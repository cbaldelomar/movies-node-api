import { Op, QueryTypes, Sequelize } from 'sequelize'
import {
  IMovieService, IMovieFilter, INewMovieId,
  ICreateMovieRequest, IUpdateMovieRequest, Result
} from '../types'
import Genre from '../data/models/genre'
import Movie from '../data/models/movie'
import { AssociationAlias, ErrorMessage, ErrorType, SqlFunction } from '../enums'
import { ResultError, ResultSuccess, ResultValidationError, ValidationError } from '../utils/result'
import { validate as isUUID } from 'uuid'

export default class MovieService implements IMovieService {
  private readonly database: Sequelize

  constructor (database: Sequelize) {
    this.database = database
  }

  getAll = async (filter: IMovieFilter): Promise<Movie[]> => {
    const genre = filter.genre?.toLowerCase() ?? null

    if (genre == null) {
      return await Movie.findAll({
        include: [AssociationAlias.Genres]
        // include: {
        //   model: Genre,
        //   as: AssociationAlias.Genres
        // }
      })
    }

    const theGenre = await Genre.findOne({
      where: {
        name: genre
      },
      include: {
        model: Movie,
        as: AssociationAlias.Movies,
        through: { attributes: [] },
        include: [
          {
            model: Genre,
            as: AssociationAlias.Genres,
            through: { attributes: [] }
          }
        ]
      }
    })

    return theGenre?.movies ?? []

    // return await Movie.findAll({
    //   include: [
    //     // Using One-to-Many association to filter by genre
    //     {
    //       model: MovieGenre,
    //       required: true,
    //       // include: [Genre]
    //       include: [
    //         {
    //           model: Genre,
    //           where: this.database.where(this.database.fn(SqlFunctions.LOWER, this.database.col('name')), genre),
    //           // where: {
    //           //   name: genre
    //           // },
    //           required: true
    //         }
    //       ]
    //     },
    //     // Using Many-to-Many association to include all genres of the filtered movies
    //     AssociationAlias.Genres
    //     // {
    //     //   model: Genre,
    //     //   as: AssociationAlias.Genres
    //     //   // required: true,
    //     //   // through: {
    //     //   //   attributes: []
    //     //   // }
    //     // }
    //   ]
    // })
  }

  getById = async (id: string): Promise<Result<Movie>> => {
    if (!isUUID(id)) {
      return ResultError.create(ErrorMessage.MOVIE_NOT_EXISTS, ErrorType.NOT_FOUND)
    }

    const movie = await Movie.findOne({
      where: {
        id: this.database.fn(SqlFunction.UUID_TO_BIN, id, true)
      },
      include: [AssociationAlias.Genres]
      // include: {
      //   model: Genre,
      //   as: AssociationAlias.Genres
      // }
    })

    if (movie == null) {
      return ResultError.create(ErrorMessage.MOVIE_NOT_EXISTS, ErrorType.NOT_FOUND)
    }

    return ResultSuccess.create(movie)
  }

  create = async (movie: ICreateMovieRequest): Promise<Result<Movie>> => {
    const { title, year, director, duration, poster, rate, genres } = movie

    // Check if movie exists.
    const { count } = await Movie.findAndCountAll({
      where: {
        title,
        year,
        director
      }
    })

    if (count > 0) {
      const error = ValidationError.create('', ErrorMessage.MOVIE_EXISTS)
      return ResultValidationError.create(error)
    }

    // Check if genres exist.
    const result = await MovieService.checkValidGenres(genres)

    if (!result.success) {
      return result
    }

    const movieGenres = result.data

    // Get new id from database.
    const { id } = (await this.database.query(
      'SELECT UUID_TO_BIN(UUID(), true) AS id',
      {
        type: QueryTypes.SELECT,
        raw: true,
        plain: true
      })) as INewMovieId

    // https://sequelize.org/docs/v6/other-topics/transactions/
    const transaction = await this.database.transaction()

    try {
      const newMovie = await Movie.create({
        id,
        title,
        year,
        director,
        duration,
        poster,
        rate
      }, { transaction })

      // await newMovie.addGenres(movieGenres, { transaction })
      await newMovie.setGenres(movieGenres, { transaction })

      await transaction.commit()

      await newMovie.reload()

      // Set the genres property.
      newMovie.genres = movieGenres

      return ResultSuccess.create(newMovie)
    } catch (error) {
      await transaction.rollback()

      throw error
    }
  }

  private static readonly checkValidGenres = async (genres: string[]): Promise<Result<Genre[]>> => {
    // Check if genres exist.
    const uniqueGenres = [...new Set(genres)]

    const movieGenres = await Genre.findAll({
      where: {
        name: {
          [Op.in]: uniqueGenres
        }
      }
    })

    if (movieGenres.length === uniqueGenres.length) {
      // Return valid genres.
      return ResultSuccess.create(movieGenres)
    }

    // Identify invalid genres.
    const validGenreNames = movieGenres.map(({ name }) => name)
    const invalidGenreNames = genres.filter(genre => !validGenreNames.includes(genre))
    const errors: ValidationError[] = []

    invalidGenreNames.forEach(invalidGenre => {
      const error = ValidationError.create('genres', ErrorMessage.INVALID_MOVIE_GENRE + ': ' + invalidGenre)
      errors.push(error)
    })

    // const error = ValidationError.create('genres', ErrorMessages.INVALID_MOVIE_GENRE + ': ' + invalidGenreNames.join(', '))

    return ResultValidationError.create(errors)
  }

  update = async (id: string, movie: IUpdateMovieRequest): Promise<Result<Movie>> => {
    const { genres } = movie
    let movieGenres: Genre[] = []

    // Get movie from database.
    const result = await this.getById(id)

    if (!result.success) return result

    const updatedMovie = result.data

    // Check valid genres.
    if (genres != null) {
      const checkResult = await MovieService.checkValidGenres(genres)

      if (!checkResult.success) {
        return checkResult
      }

      movieGenres = checkResult.data
    }

    // https://sequelize.org/docs/v6/other-topics/transactions/
    const transaction = await this.database.transaction()

    try {
      // Update movie.
      await updatedMovie.update(movie, { transaction })

      // Update movie genres.
      if (movieGenres.length > 0) {
        await updatedMovie.setGenres(movieGenres, { transaction })

        // Due to changes in genres, set the genres property.
        updatedMovie.genres = movieGenres
      }

      await transaction.commit()

      return ResultSuccess.create(updatedMovie)
    } catch (error) {
      await transaction.rollback()

      throw error
    }
  }

  delete = async (id: string): Promise<Result<Movie>> => {
    // Get movie from database.
    const result = await this.getById(id)

    if (!result.success) return result

    const movie = result.data

    const transaction = await this.database.transaction()

    try {
      await movie.destroy({ transaction })

      await transaction.commit()

      return ResultSuccess.create(movie)
    } catch (error) {
      await transaction.rollback()

      throw error
    }
  }
}

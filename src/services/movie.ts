import { Op, QueryTypes, Sequelize } from 'sequelize'
import { MovieFilter, NewMovieId } from '../types'
import Genre from '../data/models/genre'
// import MovieGenre from '../data/models/movieGenre'
import Movie from '../data/models/movie'
import { AssociationAlias, SqlFunctions } from '../enums'
import { CreateMovieDTO } from '../dto/createMovie'
import { UpdateMovieDTO } from '../dto/updateMovie'

// export interface MovieService {
//   getAll: (filter: MovieFilter) => Promise<Movie[]>
//   getById: (id: string) => Promise<Movie | null>
//   create: (movieDTO: CreateMovieDTO) => Promise<Movie | null>
// }

export default class MovieService {
  private readonly database: Sequelize

  constructor (database: Sequelize) {
    this.database = database
  }

  getAll = async (filter: MovieFilter): Promise<Movie[]> => {
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

  getById = async (id: string): Promise<Movie | null> => {
    return await Movie.findOne({
      where: {
        id: this.database.fn(SqlFunctions.UUID_TO_BIN, id, true)
      },
      include: [AssociationAlias.Genres]
      // include: {
      //   model: Genre,
      //   as: AssociationAlias.Genres
      // }
    })
  }

  create = async (movie: CreateMovieDTO): Promise<Movie> => {
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
      throw new Error('Movie already exist.')
    }

    // Check if genres exist.
    const movieGenres = await MovieService.checkValidGenres(genres)

    // Get new id from database.
    const { id } = (await this.database.query(
      'SELECT UUID_TO_BIN(UUID(), true) AS id',
      {
        type: QueryTypes.SELECT,
        raw: true,
        plain: true
      })) as NewMovieId

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

      // Set the genres property.
      newMovie.genres = movieGenres

      return newMovie
    } catch (error) {
      console.log(error)

      await transaction.rollback()

      throw new Error('Error registering movie.')
    }
  }

  private static readonly checkValidGenres = async (genres: string[]): Promise<Genre[]> => {
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
      return movieGenres
    }

    // Identify invalid genres.
    const validGenreNames = movieGenres.map(({ name }) => name)
    const invalidGenreNames = genres.filter(genre => !validGenreNames.includes(genre))
    let s: string = ''

    if (invalidGenreNames.length > 1) {
      s = 's'
    }

    throw new Error(`Invalid genre name${s}: ` + invalidGenreNames.join(', '))
  }

  update = async (id: string, movie: UpdateMovieDTO): Promise<Movie | null> => {
    const { genres } = movie
    let movieGenres: Genre[] = []

    // Get movie from database.
    const updatedMovie = await this.getById(id)

    if (updatedMovie == null) return null

    // Check valid genres.
    if (genres != null) {
      movieGenres = await MovieService.checkValidGenres(genres)
    }

    // Update movie properties.
    updatedMovie.set(movie)

    // https://sequelize.org/docs/v6/other-topics/transactions/
    const transaction = await this.database.transaction()

    try {
      // Save movie.
      await updatedMovie.save({ transaction })

      // Update movie genres.
      if (movieGenres.length > 0) {
        await updatedMovie.setGenres(movieGenres, { transaction })

        // Due to changes in genres, set the genres property.
        updatedMovie.genres = movieGenres
      }

      await transaction.commit()

      return updatedMovie
    } catch (error) {
      console.error(error)
      throw new Error('Error updating movie.')
    }
  }
}

// delete = async ({ id }) => {
//   const db = await this.database.connect()

//   try {
//     await db.beginTransaction()

//     let sql = 'DELETE FROM MovieGenre WHERE MovieId = UUID_TO_BIN(?, true)'
//     await db.execute(sql, [id])

//     sql = 'DELETE FROM Movie WHERE Id = UUID_TO_BIN(?, true)'
//     const [{ affectedRows }] = await db.execute(sql, [id])

//     await db.commit()

//     return affectedRows > 0
//   } catch (error) {
//     await db.rollback()
//     console.error(error)
//     throw new Error('Error deleting movie.')
//   }
// }

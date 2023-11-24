import { Op, QueryTypes, Sequelize } from 'sequelize'
import { MovieFilter, NewMovieId } from '../types'
import Genre from '../data/models/genre'
// import MovieGenre from '../data/models/movieGenre'
import Movie from '../data/models/movie'
import { AssociationAlias, SqlFunctions } from '../enums'
import { CreateMovieDTO } from '../dto/createMovie'

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
    const uniqueGenres = [...new Set(genres)]

    const movieGenres = await Genre.findAll({
      where: {
        name: {
          [Op.in]: uniqueGenres
        }
      }
    })

    if (movieGenres.length !== uniqueGenres.length) {
      const validGenreNames = movieGenres.map(({ name }) => name)
      const invalidGenreNames = genres.filter(genre => !validGenreNames.includes(genre))
      let s: string = ''

      if (invalidGenreNames.length > 1) {
        s = 's'
      }

      throw new Error(`Invalid genre name${s}: ` + invalidGenreNames.join(', '))
    }

    // Generate new id from database.
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

      // Set genres property.
      newMovie.genres = movieGenres

      return newMovie
    } catch (error) {
      console.log(error)

      await transaction.rollback()

      throw new Error('Error registering movie.')
    }
  }
}

// create = async ({ movie }) => {
//   const db = await this.database.connect()

//   const genres = []

//   movie.genre.forEach(async genre => {
//     const [result] = await db.query('SELECT Id FROM Genre WHERE Name = ?', [genre])

//     if (result.length === 0) {
//       throw new Error(`El genero '${genre}' no existe.`)
//     }

//     genres.push(result[0].Id)
//   })

//   const [[{ newId }]] = await db.query('SELECT UUID() AS newId')

//   try {
//     await db.beginTransaction()

//     let sql =
//       `INSERT INTO Movie (Id, Title, Year, Director, Duration, Poster, Rate)
//       VALUES (UUID_TO_BIN(?, true), ?, ?, ?, ?, ?, ?)`

//     const [{ affectedRows }] = await db.execute(sql,
//       [newId, movie.title, movie.year, movie.director, movie.duration, movie.poster, movie.rate]
//     )

//     if (affectedRows === 1) {
//       genres.forEach(async genreId => {
//         sql = 'INSERT INTO MovieGenre (MovieId, GenreId) VALUES (UUID_TO_BIN(?, true), ?)'
//         console.log(newId, genreId)
//         await db.execute(sql, [newId, genreId])
//       })
//     }

//     await db.commit()
//   } catch (error) {
//     await db.rollback()
//     console.error(error)
//     throw new Error('Error registering movie.')
//   }

//   return {
//     id: newId,
//     ...movie
//   }
// }

// update = async ({ id, movie }) => {
//   const db = await this.database.connect()

//   let sql = 'UPDATE Movie SET '
//   let properties
//   const values = []

//   for (const property in movie) {
//     properties = (properties ? properties + ', ' : '') + property + ' = ?'

//     values.push(movie[property])
//   }

//   sql += properties + ' WHERE Id = UUID_TO_BIN(?, true)'

//   values.push(id)

//   try {
//     const [{ affectedRows }] = await db.execute(sql, values)

//     if (!affectedRows) return false
//   } catch (error) {
//     console.error(error)
//     throw new Error('Error updating movie.')
//   }

//   return await this.getById({ id })
// }

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

import { Sequelize } from 'sequelize'
import { IMovieRepository, movieFilter } from '../../types'
import Genre from '../models/genre'
// import Genre from '../models/genre'
import Movie from '../models/movie'
import MovieGenre from '../models/movieGenre'

const MovieRepository: IMovieRepository = {
  getAll: async (filter: movieFilter): Promise<Movie[]> => {
    const genre = filter.genre?.toLowerCase() ?? null

    if (genre == null) {
      return await Movie.findAll({
        include: Genre
      })
    }

    return await Movie.findAll({
      include: [
        // Using One-to-Many association to filter by genre
        {
          model: MovieGenre,
          required: true,
          // include: [Genre]
          include: [
            {
              model: Genre,
              where: {
                name: genre
              },
              required: true
            }
          ]
        },
        // Using Many-to-Many association to include all genres of the filtered movies
        {
          model: Genre
          // required: true,
          // through: {
          //   attributes: []
          // }
        }
      ]
    })
  },
  getById: async (id: string): Promise<Movie | null> => {
    return await Movie.findOne({
      where: {
        id: Sequelize.where(Sequelize.fn('UUID_TO_BIN', id, true), Sequelize.col('id'))
      }
    })
  }
}

export default MovieRepository

// getById = async ({ id }) => {
//   const db = await this.database.connect()

//   const sql =
//     `SELECT
//     BIN_TO_UUID(id, true) AS Id,
//     Title,
//     Year,
//     Director,
//     Duration,
//     Poster,
//     Rate
//   FROM Movie
//   WHERE id = UUID_TO_BIN(?, true)`

//   const [movie] = await db.query(sql, [id])

//   return movie
// }

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
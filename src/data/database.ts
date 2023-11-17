import { Sequelize, Options } from 'sequelize'
import Movie from './models/movie'
import { Server } from '../types'
import Genre from './models/genre'
import MovieGenre from './models/movieGenre'

const initModels = (sequelize: Sequelize): void => {
  // Include all models configurations here.

  Movie.config(sequelize)
  Genre.config(sequelize)
  MovieGenre.config(sequelize)

  // Using Super Many-to-Many relationship approach
  // https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/#the-best-of-both-worlds-the-super-many-to-many-relationship
  Movie.belongsToMany(Genre, { through: MovieGenre })
  Genre.belongsToMany(Movie, { through: MovieGenre })
  Movie.hasMany(MovieGenre)
  MovieGenre.belongsTo(Movie)
  Genre.hasMany(MovieGenre)
  MovieGenre.belongsTo(Genre)
}

const configDatabase = (server: Server): void => {
  server.port = server.port ?? 3306

  const options: Options = {
    ...server,
    dialect: 'mysql',
    define: {
      freezeTableName: true
    }
  }

  const sequelize = new Sequelize(options)
  // await this.sequelize.authenticate()
  initModels(sequelize)
}

export default configDatabase

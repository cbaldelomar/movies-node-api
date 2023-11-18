import { Sequelize, Options } from 'sequelize'
import MovieEntity from './entities/movie'
import { Server } from '../types'
import Genre from './entities/genre'
import MovieGenre from './entities/movieGenre'

const initModels = (sequelize: Sequelize): void => {
  // Include all models configurations here.

  MovieEntity.config(sequelize)
  Genre.config(sequelize)
  MovieGenre.config(sequelize)

  // Using Super Many-to-Many relationship approach
  // https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/#the-best-of-both-worlds-the-super-many-to-many-relationship
  MovieEntity.belongsToMany(Genre, { through: MovieGenre, as: 'genres' })
  Genre.belongsToMany(MovieEntity, { through: MovieGenre, as: 'movies' })
  MovieEntity.hasMany(MovieGenre)
  MovieGenre.belongsTo(MovieEntity)
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

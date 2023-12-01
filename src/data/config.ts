import { Sequelize, Options } from 'sequelize'
import Movie from './models/movie'
import { IServer } from '../types'
import Genre from './models/genre'
import MovieGenre from './models/movieGenre'
import { AssociationAlias } from '../enums'

const configModels = (sequelize: Sequelize): void => {
  // Include all models configurations here.

  Movie.config(sequelize)
  Genre.config(sequelize)
  MovieGenre.config(sequelize)

  Movie.belongsToMany(Genre, { through: MovieGenre, as: AssociationAlias.Genres })
  Genre.belongsToMany(Movie, { through: MovieGenre, as: AssociationAlias.Movies })

  // Using Super Many-to-Many relationship approach
  // https://sequelize.org/docs/v6/advanced-association-concepts/advanced-many-to-many/#the-best-of-both-worlds-the-super-many-to-many-relationship
  // Movie.hasMany(MovieGenre)
  // MovieGenre.belongsTo(Movie)
  // Genre.hasMany(MovieGenre)
  // MovieGenre.belongsTo(Genre)
}

const configDatabase = (server: IServer): Sequelize => {
  server.port = server.port ?? 3306

  const options: Options = {
    ...server,
    dialect: 'mysql',
    define: {
      // Stop table name auto-pluralization. All tables will use the same name as the model name.
      freezeTableName: true
    }
  }

  const sequelize = new Sequelize(options)
  // await this.sequelize.authenticate()

  configModels(sequelize)

  return sequelize
}

export default configDatabase

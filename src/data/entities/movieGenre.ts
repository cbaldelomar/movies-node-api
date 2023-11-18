import { DataTypes, Model, Sequelize } from 'sequelize'
import MovieEntity from './movie'
import Genre from './genre'

export default class MovieGenre extends Model {
  static config (sequelize: Sequelize): void {
    MovieGenre.init({
      movieId: {
        type: DataTypes.STRING(16, true),
        allowNull: false,
        references: {
          model: MovieEntity,
          key: 'id'
        }
      },
      genreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Genre,
          key: 'id'
        }
      }
    }, {
      sequelize,
      modelName: 'MovieGenre',
      timestamps: false
    })
  }
}

import {
  CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute,
  Sequelize
} from 'sequelize'
import Movie from './movie'

export default class Genre extends Model<
InferAttributes<Genre, { omit: 'movies' }>,
InferCreationAttributes<Genre, { omit: 'movies' }>
> {
  declare readonly id: CreationOptional<number>
  declare name: string

  declare movies: NonAttribute<Movie[]>

  static config (sequelize: Sequelize): void {
    Genre.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
        // field: 'name'
      }
    }, {
      sequelize,
      timestamps: false
    })
  }
}

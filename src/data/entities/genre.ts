import {
  CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute,
  Sequelize
} from 'sequelize'
import Movie from './movie'

export default class Genre extends Model<
InferAttributes<Genre>,
InferCreationAttributes<Genre>
> {
  declare id: CreationOptional<number>
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
      modelName: 'Genre',
      timestamps: false
    })
  }
}

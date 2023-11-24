import {
  CreationOptional, DataTypes, HasManySetAssociationsMixin, InferAttributes,
  InferCreationAttributes, Model,
  NonAttribute,
  Sequelize
} from 'sequelize'
import Genre from './genre'
import { MovieId } from '../../types'

export default class Movie extends Model<
InferAttributes<Movie, { omit: 'genres' }>,
InferCreationAttributes<Movie, { omit: 'genres' }>
> {
  declare readonly id: CreationOptional<MovieId>
  declare readonly uuid: CreationOptional<string>
  declare title: string
  declare year: number
  declare director: string
  declare duration: number
  declare poster: string | null
  declare rate: number | null
  declare readonly createdAt: CreationOptional<Date>

  declare genres?: NonAttribute<Genre[]>

  // 'Add' methods are used to associate with new instances, but don't touch any current associations
  // declare addGenres: HasManyAddAssociationsMixin<Genre, number>
  // 'Set' methods are used to associate with ONLY these instances, all other associations will be deleted.
  declare setGenres: HasManySetAssociationsMixin<Genre, number>

  static config (sequelize: Sequelize): void {
    Movie.init({
      id: {
        type: DataTypes.STRING(16, true),
        primaryKey: true
        // defaultValue: sequelize.literal('DEFAULT')
      },
      uuid: {
        type: DataTypes.UUID,
        // get () {
        //   return sequelize.literal('BIN_TO_UUID(id, true)')
        // },
        set (_value) {
          throw new Error('`uuid` value is readonly!')
        }
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      director: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      duration: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false
      },
      poster: DataTypes.TEXT,
      rate: DataTypes.DECIMAL(2, 1),
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      sequelize,
      // modelName: 'Movie',
      timestamps: true,
      createdAt: true,
      updatedAt: false
      // freezeTableName: true
      // tableName: 'Movie'
    })
  }
}

import {
  CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute,
  Sequelize
} from 'sequelize'
import Genre from './genre'

export default class Movie extends Model<
InferAttributes<Movie, { omit: 'genres' }>,
InferCreationAttributes<Movie, { omit: 'genres' }>
> {
  declare id: CreationOptional<Buffer>
  declare uuid: string
  declare title: string
  declare year: number
  declare director: string
  declare duration: number
  declare poster: string | null
  declare rate: number | null
  declare createdAt: CreationOptional<Date>

  declare genres?: NonAttribute<Genre[]>

  static config (sequelize: Sequelize): void {
    Movie.init({
      id: {
        type: DataTypes.STRING(16, true),
        primaryKey: true
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

import { DataTypes, Model, Sequelize } from 'sequelize'

export default class Movie extends Model {
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
      modelName: 'Movie',
      timestamps: true,
      createdAt: true,
      updatedAt: false
      // freezeTableName: true
      // tableName: 'Movie'
    })
  }
}

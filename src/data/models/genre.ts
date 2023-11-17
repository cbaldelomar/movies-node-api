import { DataTypes, Model, Sequelize } from 'sequelize'

export default class Genre extends Model {
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

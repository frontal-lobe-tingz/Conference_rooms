// models/Cart.js
module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
      roomId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'rooms',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      fromDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      toDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    }, {
      tableName: 'carts',
      timestamps: true,
    });
  
    Cart.associate = (models) => {
      Cart.belongsTo(models.Room, { foreignKey: 'roomId', as: 'Room' });
      Cart.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
    };
  
    return Cart;
  };
  
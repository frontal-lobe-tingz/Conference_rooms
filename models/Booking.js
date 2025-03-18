module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
    userId: {  
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Must match the table name in User model
        key: 'id',
      },
    },
    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'rooms', // Must match the table name in Room model
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
    status: {  
      type: DataTypes.ENUM('pending', 'finalized', 'completed', 'canceled'),
      defaultValue: 'pending',
      allowNull: false,
    },
  }, {
    tableName: 'bookings',
    timestamps: true,
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.Room, { foreignKey: 'roomId', as: 'Room' });
    Booking.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
  };

  return Booking;
};

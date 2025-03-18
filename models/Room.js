module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        isValidAmenities(value) {
          if (value && !Array.isArray(value)) {
            throw new Error('Amenities must be an array');
          }
        }
      }
    },
    imageurl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  }, {
    tableName: 'rooms',
    timestamps: true,
  });

  Room.associate = (models) => {
    Room.hasMany(models.Cart, { foreignKey: 'roomId', as: 'Carts' });
    Room.hasMany(models.Booking, { foreignKey: 'roomId', as: 'Bookings' });
  };

  return Room;
};

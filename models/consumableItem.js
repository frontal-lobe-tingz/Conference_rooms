// models/ConsumableItem.js
module.exports = (sequelize, DataTypes) => {
  const ConsumableItem = sequelize.define('ConsumableItem', {
    itemId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'item_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    currentStockLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'current_stock_level',
      defaultValue: 0
    },
    reorderLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'reorder_level',
      defaultValue: 0
    }
  }, {
    tableName: 'consumable_items',
    timestamps: false
  });

  // No associations for ConsumableItem
  return ConsumableItem;
};

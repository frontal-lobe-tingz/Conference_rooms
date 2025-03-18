// routes/consumableItem.js
const express = require('express');
const router = express.Router();
const { ConsumableItem } = require('../models'); // Corrected Import
const { checkUserRole } = require('./authMiddleware');

const { Op } = require('sequelize');

const managerOrClerk = checkUserRole(['manager', 'clerk']);
const managerOnly = checkUserRole(['manager']);

// Debugging Line
console.log('ConsumableItem model:', ConsumableItem);

// GET /api/consumable-items/getall
router.get('/getall', async (req, res) => {
  try {
    const items = await ConsumableItem.findAll();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching consumable items:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch consumable items', error: error.message });
  }
});

// POST /api/consumable-items/add
router.post('/add', managerOrClerk, async (req, res) => {
  const { name, description, currentStockLevel, reorderLevel } = req.body;

  // Validate required fields
  if (!name || currentStockLevel === undefined || reorderLevel === undefined) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const newItem = await ConsumableItem.create({
      name,
      description,
      currentStockLevel,
      reorderLevel,
    });

    res.status(201).json({ success: true, message: 'Consumable item added successfully', item: newItem });
  } catch (error) {
    console.error('Error adding consumable item:', error);
    res.status(500).json({ success: false, message: 'Failed to add consumable item', error: error.message });
  }
});

// PUT /api/consumable-items/updatestock/:id
router.put('/updatestock/:id', managerOrClerk, async (req, res) => {
  const { quantity } = req.body; // Quantity to add (positive) or subtract (negative)
  const { id } = req.params;

  try {
    const item = await ConsumableItem.findByPk(id);
    if (item) {
      const newStockLevel = item.currentStockLevel + quantity;

      // Ensure stock level doesn't go negative
      if (newStockLevel < 0) {
        return res.status(400).json({ success: false, message: 'Stock level cannot be negative' });
      }

      item.currentStockLevel = newStockLevel;
      await item.save();

      res.status(200).json({ success: true, message: 'Stock level updated successfully', item });
    } else {
      res.status(404).json({ success: false, message: 'Consumable item not found' });
    }
  } catch (error) {
    console.error('Error updating stock level:', error);
    res.status(500).json({ success: false, message: 'Failed to update stock level', error: error.message });
  }
});

// PUT /api/consumable-items/update/:id
router.put('/update/:id', managerOrClerk, async (req, res) => {
  const { name, description, currentStockLevel, reorderLevel } = req.body;
  const { id } = req.params;

  try {
    const item = await ConsumableItem.findByPk(id);
    if (item) {
      item.name = name !== undefined ? name : item.name;
      item.description = description !== undefined ? description : item.description;
      item.currentStockLevel =
        currentStockLevel !== undefined ? currentStockLevel : item.currentStockLevel;
      item.reorderLevel = reorderLevel !== undefined ? reorderLevel : item.reorderLevel;

      await item.save();

      res.status(200).json({ success: true, message: 'Consumable item updated successfully', item });
    } else {
      res.status(404).json({ success: false, message: 'Consumable item not found' });
    }
  } catch (error) {
    console.error('Error updating consumable item:', error);
    res.status(500).json({ success: false, message: 'Failed to update consumable item', error: error.message });
  }
});

// DELETE /api/consumable-items/delete/:id
router.delete('/delete/:id', managerOnly, async (req, res) => {
  const { id } = req.params;

  try {
    const item = await ConsumableItem.findByPk(id);
    if (item) {
      await item.destroy();
      res.status(200).json({ success: true, message: 'Consumable item deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Consumable item not found' });
    }
  } catch (error) {
    console.error('Error deleting consumable item:', error);
    res.status(500).json({ success: false, message: 'Failed to delete consumable item', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const item = await ConsumableItem.findByPk(id);
    if (item) {
      res.status(200).json({ success: true, data: item });
    } else {
      res.status(404).json({ success: false, message: 'Consumable item not found' });
    }
  } catch (error) {
    console.error('Error fetching consumable item:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch consumable item', error: error.message });
  }
});

module.exports = router;

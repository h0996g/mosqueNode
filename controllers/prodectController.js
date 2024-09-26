// For other App Just Test 
const MealItem = require('../models/product');

// Create a new MealItem
exports.createMealItem = async (req, res) => {
    try {
        const { name, quantity } = req.body;

        // Check if a meal item with the same name already exists
        let mealItem = await MealItem.findOne({ name });

        if (mealItem) {
            // If it exists, increment the quantity
            mealItem.quantity = String(Number(mealItem.quantity) + Number(quantity));
            await mealItem.save();
            res.status(200).json(mealItem);
        } else {
            // If it doesn't exist, create a new meal item
            mealItem = new MealItem(req.body);
            await mealItem.save();
            res.status(201).json(mealItem);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Get all MealItems
exports.getMealItems = async (req, res) => {
    try {
        const mealItems = await MealItem.find();
        res.status(200).json(mealItems);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a single MealItem by ID
exports.getMealItemById = async (req, res) => {
    try {
        const mealItem = await MealItem.findById(req.params.id);
        if (!mealItem) {
            return res.status(404).json({ error: 'MealItem not found' });
        }
        res.status(200).json(mealItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a MealItem by ID
exports.updateMealItem = async (req, res) => {
    try {
        const mealItem = await MealItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!mealItem) {
            return res.status(404).json({ error: 'MealItem not found' });
        }
        res.status(200).json(mealItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a MealItem by ID
exports.deleteMealItem = async (req, res) => {
    try {
        const mealItem = await MealItem.findByIdAndDelete(req.params.id);
        if (!mealItem) {
            return res.status(404).json({ error: 'MealItem not found' });
        }
        res.status(200).json({ message: 'MealItem deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

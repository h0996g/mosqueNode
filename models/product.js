//  for other App Just Test
const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
    quantity: {
        type: String,
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    subtitle: {
        type: String,
        required: false,
    },
    isPcs: {
        type: Boolean,
        required: false,
    },
    price: {
        type: String,
        required: false,
    },
    oldPrice: {
        type: String,
        required: false,
    },
    discount: {
        type: String,
        required: false,
    },
    isFrezze: {
        type: Boolean,
        required: false,
    },
});

const MealItem = mongoose.model('MealItem', mealItemSchema);

module.exports = MealItem;

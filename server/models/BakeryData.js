const mongoose = require('mongoose');
require('mongoose-type-url');
// eslint-disable-next-line no-unused-vars
const { dbConnection } = require('./dbConnection');

// Question template (* keep track of 'resolved')
const QuestionsSchema = new mongoose.Schema({
  id: {
    type: Number, required: true, unique: true, sparse: true,
  },
  name: {
    type: String, minLength: 3, maxLength: 35, required: true,
  },
  email: String,
  phone: String,
  question: {
    type: String, minLength: 10, maxLength: 250, required: true,
  },
  resolved: { type: Boolean, default: false },
});

// Menu item template
const MenuCardSchema = new mongoose.Schema({
  id: {
    type: Number, required: true, unique: true, sparse: true,
  },
  name: {
    type: String, minLength: 6, maxLength: 50, required: true,
  },
  description: {
    type: String, minLength: 0, maxLength: 200, required: true,
  },
  price: {
    type: Number, min: 0, max: 500, required: true,
  },
  imageUrl: mongoose.SchemaTypes.Url,
  translations: {
    ru: {
      name: {
        type: String, minLength: 6, maxLength: 50, required: true,
      },
      description: {
        type: String, minLength: 0, maxLength: 200, required: true,
      },
    },
    uk: {
      name: {
        type: String, minLength: 6, maxLength: 50, required: true,
      },
      description: {
        type: String, minLength: 0, maxLength: 200, required: true,
      },
    },
  },
});

const MenuCategorySchema = new mongoose.Schema({
  category: { type: String, minLength: 6, maxLength: 30 },
  items: [{ type: MenuCardSchema, default: [] }],
  translations: {
    ru: {
      category: { type: String, minLength: 6, maxLength: 30 },
    },
    uk: {
      category: { type: String, minLength: 6, maxLength: 30 },
    },
  },
});

const Questions = mongoose.model('questions', QuestionsSchema);
const FoodCategories = mongoose.model('food_categories', MenuCategorySchema);

module.exports = {
  Questions,
  FoodCategories,
};

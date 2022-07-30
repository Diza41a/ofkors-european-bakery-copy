/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
const { Questions, FoodCategories } = require('../models/BakeryData');

/* Handlers for food items and client questions */

// Questions
const getQuestions = () => new Promise((resolve, reject) => {
  Questions.find({}, (err, entries) => {
    err ? reject(err) : resolve(entries);
  });
});

const addQuestion = (question) => new Promise((resolve, reject) => {
  // Axios duplicate key error fix
  const id = new Date().getTime();
  const newQuestion = new Questions({ ...question, id });
  newQuestion.save((err) => {
    err ? reject(err) : resolve();
  });
});

const toggleQuestionResolved = (_id) => new Promise((resolve, reject) => {
  Questions.findOne({ _id }, (err, question) => {
    if (err) {
      reject(err);
    } else {
      // eslint-disable-next-line no-param-reassign
      question.resolved = !question.resolved;
      question.save((errUpdated) => {
        errUpdated ? reject(errUpdated) : resolve();
      });
    }
  });
});

const removeQuestion = (_id) => new Promise((resolve, reject) => {
  Questions.findOneAndDelete({ _id }, (err) => {
    err ? reject(err) : resolve();
  });
});

// Food Items
const getFoodItems = () => new Promise((resolve, reject) => {
  FoodCategories.find({}, (err, entries) => {
    err ? reject(err) : resolve(entries);
  });
});

const addFoodItem = (category, item, translateFunc) => new Promise((resolve, reject) => {
  FoodCategories.findOne({ category }, (err, entry) => {
    // Save item if category doesn't exist, update/push if it does
    const id = new Date().getTime();
    item.id = id;
    if (err) {
      reject(err);
    } else if (entry === null) {
      const translations = {
        ru: {
          category,
        },
        uk: {
          category,
        },
      };
      const newCategory = new FoodCategories({ category, items: [item] });
      // Translate Category Name
      translateFunc(category, 'ru')
        .then((translatedText) => {
          translations.ru.category = translatedText;
        })
        .catch(() => {
          // error handler placeholder
        })
        .finally(() => {
          translateFunc(category, 'uk')
            .then((translatedText) => {
              translations.uk.category = translatedText;
            })
            .catch(() => {
              // error handler placeholder
            })
            .finally(() => {
              newCategory.translations = translations;
              newCategory.save((errSave) => {
                errSave ? reject(errSave) : resolve();
              });
            });
        });
    } else {
      FoodCategories.updateOne({ category }, { $push: { items: item } }, (errUpdate) => {
        errUpdate ? reject(errUpdate) : resolve();
      });
    }
  });
});

const updateFoodItem = (category, _id, updatedObj) => new Promise((resolve, reject) => {
  FoodCategories.updateOne({ category, 'items._id': _id }, {
    $set: {
      'items.$.name': updatedObj.name,
      'items.$.description': updatedObj.description,
      'items.$.price': updatedObj.price,
      'items.$.imageUrl': updatedObj.imageUrl,
      'items.$.translations': updatedObj.translations,
    },
  }, (err) => {
    err ? reject(err) : resolve();
  });
});

const deleteFoodItem = (category, _id) => new Promise((resolve, reject) => {
  FoodCategories.updateOne({ category }, {
    $pull: {
      items: { _id: { $in: [`${_id}`] } },
    },
  }, (err) => {
    err ? reject(err) : resolve();
  });
});

module.exports = {
  getQuestions,
  addQuestion,
  toggleQuestionResolved,
  removeQuestion,
  getFoodItems,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
};

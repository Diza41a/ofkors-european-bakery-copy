/* eslint-disable no-unused-expressions */
const fs = require('fs');
const path = require('path');

/* OPTIONAL: Add meaningful validation */

// Get data
const getFixedData = (field) => new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, '../metaData/meta.json'), (readErr, data) => {
    if (readErr) {
      reject(readErr);
    } else {
      const entries = JSON.parse(data);
      if (field === 'heroes' || field === 'hours' || field === 'story' || field === 'contact') {
        resolve(entries[field]);
      } else {
        resolve(entries);
      }
    }
  });
});

// Update landing page heroes
const updateHeroes = (heroesArray) => new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, '../metaData/meta.json'), (readErr, data) => {
    if (readErr) {
      reject(readErr);
    }
    const entries = JSON.parse(data);
    entries.heroes = heroesArray;
    fs.writeFile(path.join(__dirname, '../metaData/meta.json'), JSON.stringify(entries, null, '\t'), (writeErr) => {
      if (writeErr) {
        reject(writeErr);
      } else {
        resolve();
      }
    });
  });
});

// Update operation hours
const updateWorkHours = (hoursObj) => new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, '../metaData/meta.json'), (readErr, data) => {
    if (readErr) {
      reject(readErr);
    }
    const entries = JSON.parse(data);
    entries.hours = hoursObj;
    fs.writeFile(path.join(__dirname, '../metaData/meta.json'), JSON.stringify(entries, null, '\t'), (writeErr) => {
      if (writeErr) {
        reject(writeErr);
      } else {
        resolve();
      }
    });
  });
});

// Update our story page info
const updateOurStory = (newStoryObj) => new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, '../metaData/meta.json'), (readErr, data) => {
    if (readErr) {
      reject(readErr);
    }
    const entries = JSON.parse(data);
    entries.story = newStoryObj;
    fs.writeFile(path.join(__dirname, '../metaData/meta.json'), JSON.stringify(entries, null, '\t'), (writeErr) => {
      if (writeErr) {
        reject(writeErr);
      } else {
        resolve();
      }
    });
  });
});

module.exports = {
  getFixedData,
  updateHeroes,
  updateWorkHours,
  updateOurStory,
};

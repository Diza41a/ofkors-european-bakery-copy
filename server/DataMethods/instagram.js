/* eslint-disable no-unused-expressions */
const fs = require('fs');
const path = require('path');

// Update instagram gallery
const writeNewGallery = (updateObj) => new Promise((resolve, reject) => {
  fs.writeFile(path.join(__dirname, '../metaData/instagram.json'), JSON.stringify(updateObj, null, '\t'), (writeErr) => {
    if (writeErr) {
      reject(writeErr);
    } else {
      resolve();
    }
  });
});

const getGallery = () => new Promise((resolve, reject) => {
  fs.readFile(path.join(__dirname, '../metaData/instagram.json'), (readErr, data) => {
    if (readErr) {
      reject(readErr);
    }
    resolve(JSON.parse(data));
  });
});

module.exports = {
  writeNewGallery,
  getGallery,
};

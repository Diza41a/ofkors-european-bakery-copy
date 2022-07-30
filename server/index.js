/* eslint-disable no-param-reassign */
const express = require('express');
const path = require('path');
const { Translate } = require('@google-cloud/translate').v2;
const nodemailer = require('nodemailer');
const { IgApiClient } = require('instagram-private-api');
const corsProxy = require('cors-anywhere');
const session = require('express-session');
const cron = require('node-cron');
const {
  getQuestions, addQuestion, toggleQuestionResolved,
  removeQuestion, getFoodItems, addFoodItem,
  updateFoodItem, deleteFoodItem,
} = require('./DataMethods/dynamicSize');
const {
  writeNewGallery,
  getGallery,
} = require('./DataMethods/instagram');
const {
  getFixedData,
  updateHeroes,
  updateWorkHours,
  updateOurStory,
} = require('./DataMethods/fixedSize');
const {
  IG_USER, IG_PASSWORD, PORT, PROXY_PORT, HOST, EMAIL_PASS, ADMIN_PASS, EMAIL, ADMIN_EMAIL,
} = require('../config');
const translationCredentials = require('../credentials/google_translate_credentials.json');

const app = express();

// Initiate translation client
const translator = new Translate({
  projectId: translationCredentials.projectId, credentials: translationCredentials,
});

const translate = (text, langTwoLetterCode) => new Promise((resolve, reject) => {
  translator.translate(text, langTwoLetterCode)
    .then(([translation]) => resolve(translation))
    .catch((err) => reject(err));
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(session({
  secret: 'Keep it secret',
  name: 'uniqueSessionID',
  saveUninitialized: false,
  rolling: true,
  cookie: {
    // Expire session after an hour of inactivity
    maxAge: 1 * 60 * 60 * 1000,
  },
}));
// Check authentication middleware function
const isAuthenticated = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.sendStatus(401);
  }
};

// Favicon edge case handler
app.use('/favicon.ico', (req, res) => {
  res.send();
});

// Email admin credentials
app.get('/credentials', (req, res) => {
  // Email password
  const transponder = nodemailer.createTransport({
    host: 'smtp.mail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: EMAIL,
      pass: EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: EMAIL,
    to: ADMIN_EMAIL,
    subject: 'OfKors European Bakery password',
    text: `Here are your credentials ->\nemail: "${ADMIN_EMAIL}"\npassword: "${ADMIN_PASS}"`,
  };

  transponder.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    } else {
      console.log('Credential email sent!');
      res.end();
    }
  });
});

// Authentication
// Check authentication status
app.get('/authenticated', isAuthenticated, (req, res) => {
  res.sendStatus(200);
});

app.post('/authenticate', (req, res) => {
  const { email, password } = req.body;
  if (email === undefined || password === undefined) {
    res.sendStatus(422);
  } else if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASS) {
    req.session.loggedIn = true;
    res.end();
  } else {
    res.sendStatus(401);
  }
});

app.get('/logout', (req, res) => {
  req.session.loggedIn = false;
  res.end();
});

// Instagram
app.get(('/instagramFeed'), (req, res) => {
  getGallery()
    .then((entries) => res.send(entries))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});
app.put('/instagramFeed', isAuthenticated, (req, res) => {
  let { pages: pageLimit } = req.query;
  if (pageLimit === undefined || parseInt(pageLimit, 10) > 10 || parseInt(pageLimit, 10) > 10) {
    pageLimit = 5;
  }
  const ig = new IgApiClient();
  ig.state.generateDevice('diza41a');
  (async () => {
    try {
      const loggedInUser = await ig.account.login(IG_USER, IG_PASSWORD);
      const userFeed = ig.feed.user(loggedInUser.pk);
      // Get ten pages worth of latest content
      const pages = [];
      for (let i = 0; i < pageLimit; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        pages.push(await userFeed.items());
      }

      // Scrape feed for images
      const imageUrls = [];
      const videoUrls = [];
      pages.forEach((postsArray) => {
        for (let i = 0; i < postsArray.length; i += 1) {
          const postObj = postsArray[i];
          // Images from carousel
          if (postObj?.carousel_media !== undefined
            && postObj.carousel_media?.image_versions2 !== undefined
            && postObj.carousel_media?.image_versions2?.candidates !== undefined
            && postObj.carousel_media?.image_versions2?.candidates.length) {
            imageUrls.push(postObj.carousel_media?.image_versions2?.candidates[0]?.url);
          }
          // Single images
          if (postObj?.image_versions2 !== undefined
            && postObj?.image_versions2?.candidates !== undefined
            && postObj?.image_versions2?.candidates.length > 0) {
            imageUrls.push(postObj?.image_versions2?.candidates[0]?.url);
          }
          // Videos
          if (postObj?.video_versions !== undefined
            && postObj?.video_versions.length > 0) {
            videoUrls.push(postObj.video_versions[0].url);
          }
        }
      });

      const updatedInstagramData = {};
      if (imageUrls.length >= 5) {
        updatedInstagramData.imageUrls = imageUrls;
      }
      if (videoUrls.length > 0) {
        updatedInstagramData.videoUrls = videoUrls;
      }

      writeNewGallery(updatedInstagramData)
        .then(() => {
          console.log('updated instagram gallery');
          res.end();
        })
        .catch((err) => {
          console.log(err);
          res.sendStatus(500);
        });
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  })();
});
// Auto-update Instagram feed every midnight (as links expire)
cron.schedule('0 0 0 * * *', () => {
  console.log('Trying to auto-update instagram feed...');
  const pageLimit = 10;
  const ig = new IgApiClient();
  ig.state.generateDevice('diza41a');
  (async () => {
    try {
      const loggedInUser = await ig.account.login(IG_USER, IG_PASSWORD);
      const userFeed = ig.feed.user(loggedInUser.pk);
      // Get ten pages worth of latest content
      const pages = [];
      for (let i = 0; i < pageLimit; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        pages.push(await userFeed.items());
      }

      // Scrape feed for images
      const imageUrls = [];
      const videoUrls = [];
      pages.forEach((postsArray) => {
        for (let i = 0; i < postsArray.length; i += 1) {
          const postObj = postsArray[i];
          // Images from carousel
          if (postObj?.carousel_media !== undefined
            && postObj.carousel_media?.image_versions2 !== undefined
            && postObj.carousel_media?.image_versions2?.candidates !== undefined
            && postObj.carousel_media?.image_versions2?.candidates.length) {
            imageUrls.push(postObj.carousel_media?.image_versions2?.candidates[0]?.url);
          }
          // Single images
          if (postObj?.image_versions2 !== undefined
            && postObj?.image_versions2?.candidates !== undefined
            && postObj?.image_versions2?.candidates.length > 0) {
            imageUrls.push(postObj?.image_versions2?.candidates[0]?.url);
          }
          // Videos
          if (postObj?.video_versions !== undefined
            && postObj?.video_versions.length > 0) {
            videoUrls.push(postObj.video_versions[0].url);
          }
        }
      });

      const updatedInstagramData = {};
      if (imageUrls.length >= 5) {
        updatedInstagramData.imageUrls = imageUrls;
      }
      if (videoUrls.length > 0) {
        updatedInstagramData.videoUrls = videoUrls;
      }

      writeNewGallery(updatedInstagramData)
        .then(() => {
          console.log('updated instagram gallery');
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  })();
});

// Fixed size data
app.get('/fixedData', (req, res) => {
  const { field } = req.query;
  getFixedData(field)
    .then((entries) => res.send(entries))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.put('/fixedData', isAuthenticated, (req, res) => {
  const { field } = req.query;
  const update = req.body;

  if (field === 'heroes') {
    update.forEach((hero) => {
      if (hero.translations === undefined) {
        hero.translations = {
          ru: {
            name: hero.name,
          },
          uk: {
            name: hero.name,
          },
        };
      }
    });
    const ruNameTranslationPromises = update.map((heroInfo, i) => new Promise((resolve) => {
      translate(heroInfo.name, 'ru')
        .then((translatedName) => {
          update[i].translations.ru.name = translatedName;
        })
        .catch(() => {
          // error handler placeholder
        })
        .finally(() => {
          resolve();
        });
    }));
    const ukNameTranslationPromises = update.map((heroInfo, i) => new Promise((resolve) => {
      translate(heroInfo.name, 'uk')
        .then((translatedName) => {
          update[i].translations.uk.name = translatedName;
        })
        .catch(() => {
          // error handler placeholder
        })
        .finally(() => {
          resolve();
        });
    }));

    Promise.all([...ruNameTranslationPromises, ...ukNameTranslationPromises])
      .catch(() => {
        // Error handling placeholder
      })
      .finally(() => {
        updateHeroes(update)
          .then(() => res.end())
          .catch((err) => {
            console.log(err);
            res.sendStatus(500);
          });
      });
  } else if (field === 'hours') {
    updateWorkHours(update)
      .then(() => res.end())
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  } else if (field === 'story') {
    updateOurStory(update)
      .then(() => res.end())
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  } else {
    console.log(`Invalid query parameter: ${field}`);
    res.sendStatus(500);
  }
});

// Questions
app.post('/questions', (req, res) => {
  addQuestion(req.body)
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.get('/questions', isAuthenticated, (req, res) => {
  getQuestions()
    .then((questions) => res.json(questions.reverse()))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.put('/questions/:id', isAuthenticated, (req, res) => {
  const { id: _id } = req.params;
  if (_id === undefined) {
    res.sendStatus(400);
  } else {
    toggleQuestionResolved(_id)
      .then(() => res.send(`Question ${_id} toggled.`))
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  }
});

app.delete('/questions/:id', isAuthenticated, (req, res) => {
  const { id: _id } = req.params;
  if (_id === undefined) {
    res.sendStatus(400);
  } else {
    removeQuestion(_id)
      .then(() => res.send(`Question ${_id} removed.`))
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  }
});

// Food Items
// Helper -> Get the translations (russian, ukrainian)
const translateFoodItem = (foodItem) => {
  // Desctructure for only relevant to the translation parts
  const {
    name, description, translations,
  } = foodItem;

  return new Promise((resolve) => {
    translate(name, 'ru')
      .then((translatedText) => {
        translations.ru.name = translatedText;
      })
      .catch(() => {
        // error handler placeholder
      })
      .finally(() => {
        translate(description, 'ru')
          .then((translatedText) => {
            translations.ru.description = translatedText;
          })
          .catch(() => {
            // error handler placeholder
          })
          .finally(() => {
            translate(name, 'uk')
              .then((translatedText) => {
                translations.uk.name = translatedText;
              })
              .catch(() => {
                // error handler placeholder
              })
              .finally(() => {
                translate(description, 'uk')
                  .then((translatedText) => {
                    translations.uk.description = translatedText;
                  })
                  .catch(() => {
                    // error handler placeholder
                  })
                  .finally(() => {
                    resolve({ ...foodItem, translations });
                  });
              });
          });
      });
  });
};

app.post('/categories', isAuthenticated, (req, res) => {
  let {
    // eslint-disable-next-line prefer-const
    name, description, category, imageUrl,
  } = req.body;
  const translations = {
    ru: {
      name,
      description,
    },
    uk: {
      name,
      description,
    },
  };
  // TODO: Handle default value for placeholder image in mongoose schema
  if (imageUrl === undefined) {
    imageUrl = 'placeholder';
  }

  translateFoodItem({ ...req.body, translations })
    .then((newFoodItem) => {
      addFoodItem(category, newFoodItem, translate)
        .then(() => res.end())
        .catch((err) => {
          console.log(err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log(err);
      res.send(500);
    });
});

app.get('/categories', (req, res) => {
  getFoodItems()
    .then((foodItems) => {
      // res.json(foodItems);
      // TODO: no need for that after optimization:
      // empty categories will not exist!
      const filled = foodItems.filter((category) => category.items.length);
      res.json(filled);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

app.put('/categories/:id', isAuthenticated, (req, res) => {
  const { id: _id } = req.params;
  let {
    // eslint-disable-next-line prefer-const
    name, description, category,
  } = req.body;
  const translations = {
    ru: {
      name,
      description,
    },
    uk: {
      name,
      description,
    },
  };

  translateFoodItem({ ...req.body, translations })
    .then((newFoodItem) => {
      updateFoodItem(category, _id, newFoodItem)
        .then(() => res.send(`Menu item ${_id} updated!`))
        .catch((err) => {
          console.log(err);
          res.sendStatus(500);
        });
    })
    .catch((err) => {
      console.log(err);
      res.send(500);
    });
});

app.delete('/categories/:id', isAuthenticated, (req, res) => {
  const { id: _id } = req.params;
  const { category } = req.body;
  deleteFoodItem(category, _id)
    .then(() => res.send(`Menu item ${_id} deleted.`))
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// Proxy server, mainly for instagram media CORS handling
// Listen on a specific host via the HOST environment variable
const host = '0.0.0.0';
// Listen on a specific port via the PORT environment variable
const proxyPort = PROXY_PORT || 8080;
corsProxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: [],
  removeHeaders: [],
}).listen(proxyPort, host, () => {
  console.log(`Running CORS Anywhere on ${host}:${proxyPort}`);
});

const port = PORT || 3000;
app.listen(port, () => {
  console.log(`listening on  http://localhost:${port}`);
});

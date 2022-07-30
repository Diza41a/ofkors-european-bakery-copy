/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const {
  HOST,
  PROXY_PORT,
} = require('../../../../config');

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, toggleLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [metaData, setMetaData] = useState({
    contact: {},
    heroes: [],
    hours: {},
    story: {},
  });

  // Handlers
  // Questions
  const renderQuestions = () => {
    const resolved = [];
    const unresolved = [];
    questions.forEach((question) => {
      question.resolved ? resolved.push(question) : unresolved.push(question);
    });
    const questionListEls = (array) => array.map((question, index) => (
      <li className="question" key={index}>
        <div className="top-row">
          <h5 className="username bold">{`@${question.name}`}</h5>
          {/* TODO: Keep track of date */}
          <span className="timestamp">01/08/2022</span>
        </div>
        <p className="regular">{question.question}</p>
        <h4 className="bold">
          Phone:
          <a href={`tel:${question.phone !== null ? question.phone : ''}`} className="regular">
            {question.phone !== null ? question.phone : 'None'}
          </a>
        </h4>
        <h4 className="bold">
          Email:
          <a className="regular" href={`mailto:${question.email !== null ? question.email : ''}`}>
            {question.email !== null ? question.email : 'None'}
          </a>
        </h4>
        <button className="resolve-btn" type="button" data-id={question._id}>Toggle</button>
        <button className="close-btn" type="button" data-id={question._id}>X</button>
      </li>
    ));
    return (
      <>
        <div className="questions-subsection">
          <h3 className="title">Unresolved</h3>
          <ul className="questions-list">
            {questionListEls(unresolved)}
          </ul>
        </div>
        <div className="questions-subsection">
          <h3 className="title">Resolved</h3>
          <ul className="questions-list">
            {questionListEls(resolved)}
          </ul>
        </div>
      </>
    );
  };
  const questionStatusHandler = (e) => {
    e.preventDefault();
    const _id = e.target.getAttribute('data-id');
    if (_id === null || _id === undefined) {
      return;
    }
    // Toggle 'resolved' status || delete customer questions
    if (e.target?.classList?.contains('close-btn')) {
      axios.delete(`/questions/${_id}`)
        .then(() => {
          console.log(`Question ${_id} deleted!`);
          const updatedQuestions = questions.filter((question) => question._id !== _id);
          setQuestions(updatedQuestions);
        })
        .catch((err) => {
          console.log(err);
          if (err.request.status === 401) {
            navigate('/admin-login');
          }
        });
    } else if (e.target?.classList?.contains('resolve-btn')) {
      axios.put(`/questions/${_id}`)
        .then(() => {
          console.log(`Question ${_id} status toggled!`);
          const updatedQuestions = questions.map((question) => {
            if (question._id === _id) {
              question.resolved = !question.resolved;
            }
            return question;
          });
          setQuestions(updatedQuestions);
        })
        .catch((err) => {
          console.log(err);
          if (err.request.status === 401) {
            navigate('/admin-login');
          }
        });
    }
  };
  // Categories
  const renderFoodItems = () => (
    categories.map((foodSection, i) => (
      <div className="subsection" key={i}>
        <h3 className="title">{foodSection.category}</h3>
        <div className="item-cards" data-category={foodSection.category}>
          {foodSection.items.map((foodItem, j) => {
            // Validate image source
            axios.get(`http://${HOST}:${PROXY_PORT}/${foodItem.imageUrl}`)
              .then(() => {
                document.querySelector(`.img[data-id='${foodItem._id}']`).style.backgroundImage = `url('${`http://${HOST}:${PROXY_PORT}/${foodItem.imageUrl}`}')`;
              })
              .catch(() => {
                // placeholder will be displayed
              });

            return (
              <div className="card" key={j}>
                {/* TODO: replace with imageUrl || placeholder image */}
                <div className="img" data-id={foodItem._id}>
                  <div className="card-description-wrap-admin">
                    <textarea
                      className="card-description"
                      placeholder={foodItem.description}
                      data-id={foodItem._id}
                      data-category={foodSection.category}
                    />
                  </div>
                </div>
                <div className="meta-info">
                  <div className="row">
                    <input className="price" placeholder={foodItem.price} data-id={foodItem._id} data-category={foodSection.category} />
                  </div>

                  <input className="name" placeholder={foodItem.name} data-id={foodItem._id} data-category={foodSection.category} />
                  <input type="text" className="imageUrl" placeholder={foodItem.imageUrl} data-id={foodItem._id} data-category={foodSection.category} />
                </div>
                <button className="delete-item-btn" type="button" data-id={foodItem._id} data-category={foodSection.category}>X</button>
                <button className="update-item-btn" type="button" data-id={foodItem._id} data-category={foodSection.category}>
                  <i className="fa-solid fa-check icon update-item-btn" data-id={foodItem._id} data-category={foodSection.category} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    ))
  );
  const addFoodItem = (e) => {
    e.preventDefault();
    const categoryEl = document.querySelector('#category-input');
    const nameEl = document.querySelector('#name-input');
    const imageUrlEl = document.querySelector('#image-input');
    const priceEl = document.querySelector('#price-input');
    const descriptionEl = document.querySelector('#description-input');

    const category = categoryEl.value.trim();
    const name = nameEl.value.trim();
    const imageUrl = imageUrlEl.value.trim();
    const price = priceEl.value.trim();
    const description = descriptionEl.value.trim();

    // TODO: expand input validation
    let emptyInputExists = false;
    [categoryEl, nameEl, imageUrlEl, priceEl, descriptionEl].forEach((el) => {
      if (el.value.trim().length < 1) {
        // tooltip message
        emptyInputExists = true;
        el.placeholder = 'fill me!';
      } else {
        el.placeholder = '';
      }
    });

    if (emptyInputExists) {
      return;
    }
    // TODO: tooltip message on success or failure
    axios.post('/categories', {
      category, name, imageUrl, price, description,
    })
      .then(() => {
        axios.get('/categories')
          .then((res) => setCategories(res.data))
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
        if (err.request.status === 401) {
          navigate('/admin-login');
        }
      });
  };
  const foodItemStatusHandler = (e) => {
    e.preventDefault();
    const _id = e.target.getAttribute('data-id');
    const currentCategory = e.target.getAttribute('data-category');
    if (_id === null || _id === undefined
      || currentCategory === null || currentCategory === undefined) {
      return;
    }
    // Delete / Update food item
    if (e.target?.classList?.contains('delete-item-btn')) {
      axios.delete(`/categories/${_id}`, { data: { category: currentCategory } })
        .then(() => {
          console.log(`Menu item ${_id} deleted!`);
          axios.get('/categories')
            .then((res) => setCategories(res.data))
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
          if (err.request.status === 401) {
            navigate('/admin-login');
          }
        });
    } else if (e.target?.classList?.contains('update-item-btn')) {
      // Gather updated inputs
      const descriptionEl = document.querySelector(`.card-description[data-id="${_id}"]`);
      const priceEl = document.querySelector(`.price[data-id="${_id}"]`);
      const nameEl = document.querySelector(`.name[data-id="${_id}"]`);
      const imageUrlEl = document.querySelector(`.imageUrl[data-id="${_id}"]`);

      const valueForUpdate = (el) => {
        const value = el.value.length > 0 ? el.value : el.placeholder;
        return value;
      };

      const updateObj = {
        description: valueForUpdate(descriptionEl),
        price: valueForUpdate(priceEl),
        name: valueForUpdate(nameEl),
        imageUrl: valueForUpdate(imageUrlEl),
        category: currentCategory,
      };

      axios.put(`/categories/${_id}`, (updateObj))
        .then(() => {
          [descriptionEl, priceEl, nameEl, imageUrlEl].forEach((el) => {
            el.value = '';
          });
          axios.get('/categories')
            .then((res) => setCategories(res.data))
            .catch((err) => {
              console.log(err);
              if (err.request.status === 401) {
                navigate('/admin-login');
              }
            });
        })
        .catch((err) => console.log(err));
    }
  };
  // Fixed Data
  // Landing Page Heroes
  const updateLandingHeroes = (e) => {
    e.preventDefault();
    const heroNameEls = document.querySelectorAll('input[data-task="landing-hero-name"]');
    const heroUrlEls = document.querySelectorAll('input[data-task="landing-hero-url"]');

    const newHeroes = [];
    for (let i = 0; i < heroNameEls.length; i += 1) {
      /* If new value is not present, the current value
       from the placeholder will be placed instead */
      const newName = heroNameEls[i]?.value.trim() || '';
      const newUrl = heroUrlEls[i]?.value.trim() || '';
      const currName = heroNameEls[i]?.placeholder;
      const currUrl = heroUrlEls[i]?.placeholder;
      /* TODO: keep false, until future visual updates,
       where this will make a difference */
      const newHero = { new: false };
      if (newName.length > 0) {
        newHero.name = newName;
      } else {
        newHero.name = currName;
      }
      if (newUrl.length > 0) {
        newHero.imageUrl = newUrl;
      } else {
        newHero.imageUrl = currUrl;
      }

      newHeroes.push(newHero);
    }

    // PUT request for 'heroes' field
    axios.put('/fixedData?field=heroes', newHeroes)
      .then(() => {
        // Clear inputs
        [...heroNameEls, ...heroUrlEls].forEach((el) => {
          el.value = '';
        });
        setMetaData({ ...metaData, heroes: newHeroes });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Operation Hours
  const updateHours = (e) => {
    // bookmark
    e.preventDefault();
    const newHours = {};
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (const dayName of Object.keys(metaData?.hours)) {
      if ([
        'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        .includes(dayName)) {
        const dayObj = metaData.hours[dayName];
        const fromHour = parseInt(document.querySelector(
          `[data-day="${dayName}"][data-task="time"][data-day-task="from-hour"]`,
        )?.value.trim() || dayObj?.from?.hour || '5', 10);
        const fromMinute = parseInt(document.querySelector(
          `[data-day="${dayName}"][data-task="time"][data-day-task="from-minute"]`,
        )?.value?.trim() || dayObj?.from?.minute || '5', 10);
        const toHour = parseInt(document.querySelector(
          `[data-day="${dayName}"][data-task="time"][data-day-task="to-hour"]`,
        )?.value?.trim() || dayObj?.to?.hour || '5', 10);
        const toMinute = parseInt(document.querySelector(
          `[data-day="${dayName}"][data-task="time"][data-day-task="to-minute"]`,
        )?.value?.trim() || dayObj?.to?.minute || '5', 10);
        const closed = document.querySelector(`[data-day="${dayName}"][data-task="closed-status"]`)?.checked;

        newHours[dayName] = {
          from: {
            hour: fromHour,
            minute: fromMinute,
          },
          to: {
            hour: toHour,
            minute: toMinute,
          },
          closed,
        };
      }
    }

    // PUT request for 'hours' field
    axios.put('/fixedData?field=hours', newHours)
      .then(() => {
        // Clear inputs
        const hourEls = document.querySelectorAll('[data-task="time"]');
        hourEls.forEach((el) => {
          el.value = '';
        });
        setMetaData({ ...metaData, hours: newHours });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Our Story
  const updateOurStory = (e) => {
    e.preventDefault();
    const newOurStory = { hero1Url: '', hero2Url: '', text: { en: '', ru: '', uk: '' } };
    const storyTextEls = document.querySelectorAll('[data-task="story-text"]');
    const storyUrlEls = document.querySelectorAll('[data-task="story-url"]');

    let hero1Url = '';
    let hero2Url = '';
    if (storyUrlEls.length > 0) {
      hero1Url = storyUrlEls[0]?.value.trim().length > 0 ? storyUrlEls[0]?.value.trim()
        : metaData.story.hero1Url;
      newOurStory.hero1Url = hero1Url;
      if (storyUrlEls.length > 1) {
        hero2Url = storyUrlEls[1]?.value.trim().length > 0 ? storyUrlEls[1]?.value.trim()
          : metaData.story.hero2Url;
        newOurStory.hero2Url = hero2Url;
      }
    }

    for (let i = 0; i < storyTextEls.length; i += 1) {
      const lang = storyTextEls[i]?.getAttribute('data-lang');
      console.log(lang);
      const text = storyTextEls[i]?.value.trim().length > 0 ? storyTextEls[i]?.value.trim()
        : metaData.story.text[lang];
      newOurStory.text[lang] = text;
    }

    // PUT request for 'story' field
    axios.put('/fixedData?field=story', newOurStory)
      .then(() => {
        // Clear inputs
        [...storyTextEls, ...storyUrlEls].forEach((el) => {
          el.value = '';
        });
        setMetaData({ ...metaData, story: newOurStory });
      })
      .catch((err) => {
        console.log(err);
        alert(err);
      });
  };
  // Instagram Gallery
  const updateInstagramGallery = (e) => {
    e.preventDefault();
    axios.put('/instagramFeed?pages=10')
      .then(() => alert('Instagram gallery updated 👍'))
      .catch((err) => {
        alert('Couldn\'t update gallery:', err);
      });
  };

  // Nav methods
  const openBurgerMenu = (e) => {
    e.preventDefault();
    const burgerMenu = document.querySelector('nav.nav');
    if (burgerMenu?.classList?.contains('hidden')) {
      burgerMenu?.classList?.remove('hidden');
    }
  };
  const closeBurgerMenu = (e) => {
    e.preventDefault();
    const burgerMenu = document.querySelector('nav.nav');
    if (!burgerMenu?.classList?.contains('hidden')) {
      burgerMenu?.classList?.add('hidden');
    }
  };
  const switchSection = (e) => {
    e.preventDefault();
    if (!e.target?.classList?.contains('nav-btn')) {
      return;
    }

    const section = e.target.getAttribute('data-section');
    document.querySelectorAll('.dashboard-section').forEach((el) => {
      if (el.getAttribute('data-section') !== section) {
        el.classList.add('hidden');
      } else {
        el.classList.remove('hidden');
      }
    });

    document.querySelector('nav.nav').classList.add('hidden');
  };
  // Logout
  const logout = (e) => {
    e.preventDefault();
    axios.get('/logout')
      .catch((err) => console.log(err))
      .finally(() => navigate('/admin-login'));
  };

  // ComponentDidMount
  useEffect(() => {
    // Populate state
    // Menu
    axios.get('/categories')
      .then((resCategories) => setCategories(resCategories.data))
      .catch((err) => console.log(err))
      .finally(() => {
        // Questions
        axios.get('/questions')
          .then((resQuestions) => {
            setQuestions(resQuestions.data);
            axios.get('/fixedData')
              .then((resMeta) => setMetaData(resMeta.data))
              .catch((err) => {
                console.log(err);
                if (err.request.status === 401) {
                  navigate('/admin-login');
                }
              })
              .finally(() => toggleLoading(false));
          })
          .catch((err) => {
            console.log(err);
            if (err.request.status === 401) {
              navigate('/admin-login');
            }
          });
      });
  }, []);

  useEffect(() => {
    axios.get('/authenticated')
      .catch((err) => {
        console.log(err);
        if (err.request.status === 401) {
          navigate('/admin-login');
        }
      });
  });

  return (
    loading
      ? (
        // Loading spinner
        <section className="admin-login-section">
          <div className="login-section-wrap">
            <div className="login-section">
              <div className="loading">
                <div className="loading-spinner" />
              </div>
            </div>
          </div>
        </section>
      )
      : (
        <>
          <section className="admin-dashboard">
            <nav className="nav hidden" onClick={switchSection}>
              <Link to="/">
                <div className="logo-wrap">
                  <div className="logo" />
                </div>
              </Link>
              <button className="nav-btn" type="button" data-section="questions">Questions</button>
              <button className="nav-btn" type="button" data-section="menu">Menu</button>
              <button className="nav-btn" type="button" data-section="fixedData">Fixed Data</button>

              <button className=" nav-btn logout-btn" type="button" onClick={logout}>Logout</button>
              <button id="burger-close-btn" type="button" onClick={closeBurgerMenu}>X</button>
            </nav>

            <section className="questions-section dashboard-section" data-section="questions" onClick={questionStatusHandler}>
              <h2 className="title">Questions</h2>
              <hr />
              {renderQuestions()}
            </section>

            <section className="menu-section dashboard-section hidden" data-section="menu" onClick={foodItemStatusHandler}>
              <h2 className="title">Menu</h2>
              <hr />
              <div className="form-wrap">
                <h2 className="title">Add new item:</h2>
                <form action="">
                  <label htmlFor="category-input">
                    Category
                    <input type="text" id="category-input" />
                  </label>
                  <label htmlFor="name-input">
                    Name
                    <input type="text" id="name-input" />
                  </label>
                  <label htmlFor="image-input">
                    Image URL
                    <input type="text" id="image-input" />
                  </label>
                  <label htmlFor="price-input">
                    Price
                    <input type="text" id="price-input" />
                  </label>
                  <label htmlFor="description-input">
                    Description
                    <textarea name="description-input" id="description-input" cols="30" rows="2.5" />
                  </label>
                  <button className="" id="new-item-btn" type="button" onClick={addFoodItem}>Add +</button>
                </form>
              </div>

              <div className="menu-body-admin">
                <div className="menu-wrap">
                  <div className="menu">
                    {renderFoodItems()}
                  </div>
                </div>
              </div>
            </section>

            <section className="fixed-data-section dashboard-section hidden" data-section="fixedData">

              <h2 className="title">Landing Heroes</h2>
              <hr />

              <form action="" id="landing-heroes-form">
                {/* Render landing hero edit controls */}
                {metaData.heroes.map((hero, i) => (
                  <div className="landing-hero-wrap" key={i}>
                    <input type="text" placeholder={hero.name} data-task="landing-hero-name" />
                    <input type="text" placeholder={hero.imageUrl} data-task="landing-hero-url" />
                  </div>
                ))}

                <button className="update-heroes-btn" type="button" onClick={updateLandingHeroes}>Update</button>

              </form>

              <h2 className="title">Operation Hours</h2>
              <hr />

              <form action="" id="operation-hours-form">
                {Object.keys(metaData.hours).map((dayName, i) => {
                  const day = metaData.hours[dayName];

                  return (
                    <div className="day-section" key={i}>
                      <p className="day">{dayName}</p>
                      <p>From:</p>
                      <input type="text" placeholder={day.from.hour} data-task="time" data-day={dayName} data-day-task="from-hour" />
                      <input type="text" placeholder={day.from.minute} data-task="time" data-day={dayName} data-day-task="from-minute" />
                      <p>To:</p>
                      <input type="text" placeholder={day.to.hour} data-task="time" data-day={dayName} data-day-task="to-hour" />
                      <input type="text" placeholder={day.to.minute} data-task="time" data-day={dayName} data-day-task="to-minute" />

                      <div className="closed-status-wrap">
                        <input type="checkbox" className="closed-chk" data-task="closed-status" defaultChecked={day.closed || false} data-day={dayName} />
                        <span>Closed</span>
                      </div>
                    </div>
                  );
                })}

                <button className="update-heroes-btn" type="button" onClick={updateHours}>Update</button>
              </form>

              <h2 className="title">Our Story</h2>
              <hr />

              <form action="" id="our-story-form">
                <span>Hero 1</span>
                <input placeholder={metaData.story?.hero1Url || 'Image Url'} id="story-hero1-input" data-task="story-url" />
                <span>Hero 2</span>
                <input placeholder={metaData.story?.hero2Url || 'Image Url'} id="story-hero2-input" data-task="story-url" />
                <span>Story (English)</span>
                <textarea name="" id="" cols="30" rows="10" placeholder={metaData.story?.text.en || ''} data-task="story-text" data-lang="en" />
                <span>Story (Russian)</span>
                <textarea name="" id="" cols="30" rows="10" placeholder={metaData.story?.text.ru || ''} data-task="story-text" data-lang="ru" />
                <span>Story (Ukrainian)</span>
                <textarea name="" id="" cols="30" rows="10" placeholder={metaData.story?.text.uk || ''} data-task="story-text" data-lang="uk" />

                <button className="update-heroes-btn" type="button" onClick={updateOurStory}>Update</button>
              </form>

              <button type="button" id="update-instagram" onClick={updateInstagramGallery}>Update Instagram</button>
            </section>

            <button type="button" id="burger-btn" onClick={openBurgerMenu}>
              <i className="fa-solid fa-bars icon" />
            </button>

          </section>

          {/* For now, background attributed to:
        Momika Shrestha -> https://codepen.io/Momika/pen/ydaWmQ */}
          <section className="sticky dashboard-bubbles">
            <div className="bubbles">
              <div className="bubble" />
              <div className="bubble" />
              <div className="bubble" />
              <div className="bubble" />
              <div className="bubble" />
              <div className="bubble" />
              <div className="bubble" />
              <div className="bubble" />
              <div className="bubble" />
              <div className="bubble" />
            </div>
          </section>
        </>
      )
  );
}

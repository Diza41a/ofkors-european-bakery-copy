/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import i18n from '../i18n';

const {
  HOST,
  PROXY_PORT,
} = require('../../../config');

export default function Menu() {
  const { t } = useTranslation();

  const [menu, setMenu] = useState([]);

  // Lang abbreviations (for menu rendering)
  const langAbbreviation = {
    українська: 'uk',
    русский: 'ru',
  };

  // Display description of the food item
  const toggleInfo = (e) => {
    e.preventDefault();
    if (e.target?.classList?.contains('info-toggle')) {
      const parentCard = e.target.closest('.card');
      if (parentCard !== null) {
        if (parentCard?.classList?.contains('info-toggled')) {
          parentCard?.classList?.remove('info-toggled');
        } else {
          parentCard?.classList?.add('info-toggled');
        }
      }
    }
  };
  const scrollToCategory = (e) => {
    e.preventDefault();
    if (!e.target?.classList?.contains('category-nav')) {
      return;
    }

    const category = e.target.getAttribute('data-category');
    const subsectionTarget = document.querySelector(`.subsection[data-category="${category}"]`);
    const { top, left } = subsectionTarget.getBoundingClientRect();

    window.scroll({ top, left, behavior: 'smooth' });
  };

  // Rendering
  const renderCategoryNavList = () => (
    <ul onClick={scrollToCategory}>
      {menu.map((subsection, i) => (
        <li className="category-nav" key={i} data-category={subsection.category}>
          {/* <div className="checkbox">
            <i className="fa-solid fa-check icon" />
          </div> */}
          <span className="category-nav" data-category={subsection.category}>
            {(() => {
              const { language } = i18n;
              if (['русский', 'українська'].includes(language) && subsection?.translations) {
                return subsection?.translations[langAbbreviation[language]].category;
              }
              return subsection.category;
            })()}
          </span>
        </li>
      ))}
    </ul>
  );
  const renderMenu = () => (
    <div className="menu" onClick={toggleInfo}>
      {menu.map((subsection, i) => (
        <div className="subsection" key={i} data-category={subsection.category}>
          <h3 className="title">
            {(() => {
              const { language } = i18n;
              if (['русский', 'українська'].includes(language) && subsection?.translations) {
                return subsection?.translations[langAbbreviation[language]].category;
              }
              return subsection.category;
            })()}

          </h3>
          <div className="item-cards">
            {subsection.items.map((foodItem, j) => {
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
                  <div className="img" data-id={foodItem._id}>
                    <div className="card-description-wrap">
                      <span className="card-description">
                        {(() => {
                          const { language } = i18n;
                          if (['русский', 'українська'].includes(language)) {
                            return foodItem.translations[langAbbreviation[language]].description;
                          }
                          return foodItem.description;
                        })()}
                      </span>
                    </div>
                  </div>
                  <div className="meta-info">
                    <div className="row">
                      <span className="price">{`$${foodItem.price}`}</span>
                      <i className="fa-solid fa-info info-toggle" />
                    </div>

                    <p>
                      {' '}
                      {(() => {
                        const { language } = i18n;
                        if (['русский', 'українська'].includes(language)) {
                          return foodItem.translations[langAbbreviation[language]].name;
                        }
                        return foodItem.name;
                      })()}

                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  // ComponentDidMount
  useEffect(() => {
    // GET menu
    axios.get('/categories')
      .then((res) => {
        setMenu(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="menu-section">
      <div className="hero-wrap">
        <div className="hero">
          {/* Animation */}
          <div className="bg" />
          <div className="bg bg2" />
          <div className="bg bg3" />

          <h1 className="title">{t('menu.hero')}</h1>
        </div>
      </div>

      <div className="menu-body">
        <div className="filter-wrap hidden">
          <div className="filter-categories">
            <h4
              className="title"
              id="filter-menu-btn"
              onClick={(e) => {
                e.preventDefault();
                const categoriesList = document.querySelector('.filter-wrap');
                if (categoriesList?.classList?.contains('hidden')) {
                  categoriesList.classList.remove('hidden');
                } else {
                  categoriesList.classList.add('hidden');
                }
              }}
            >
              <span>{t('menu.categories')}</span>
              <i className="fa-solid fa-filter icon" />
              <i className="fa-solid fa-angle-down icon drop" />
            </h4>
            {renderCategoryNavList()}
          </div>
        </div>

        <div className="menu-wrap">
          {renderMenu()}
        </div>
      </div>

    </div>
  );
}

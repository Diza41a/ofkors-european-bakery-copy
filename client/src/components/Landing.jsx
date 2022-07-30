/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import i18n from '../i18n';

import LanguageSelector from '../reusable/LanguageSelector';

export default function Landing() {
  const { t } = useTranslation();
  const langAbbreviation = {
    українська: 'uk',
    русский: 'ru',
  };

  const [landingHeroes, setLandingHeroes] = useState([{
    new: false,
    name: 'Butter Croissant',
    imageUrl: '../assets/images/croissant.png',
  }]);

  // ComponentDidMount
  useEffect(() => {
    axios.get('/fixedData?field=heroes')
      .then(({ data }) => {
        setLandingHeroes(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    /* Bug: The hero title doesn't update with everything else on language change,
      hence, the handler ->> */
    const heroTitleEl = document.getElementById('hero-title');
    if (heroTitleEl !== null && heroTitleEl !== undefined) {
      const { language } = i18n;
      const heroIndex = parseInt(heroTitleEl.getAttribute('data-index'), 10);
      if (Number.isNaN(heroIndex)) {
        return;
      }
      if (['русский', 'українська'].includes(language) && landingHeroes[heroIndex]?.translations) {
        heroTitleEl.innerText = landingHeroes[heroIndex]
          .translations[langAbbreviation[language]]?.name || landingHeroes[heroIndex].name;
      } else {
        heroTitleEl.innerText = landingHeroes[heroIndex].name;
      }
    }
  });

  // Slideshow
  const slideshowNav = (e) => {
    if (!e.target?.classList?.contains('item')) {
      return;
    }
    const heroIndex = parseInt(e.target.getAttribute('data-index'), 10);
    const heroImgEl = document.querySelectorAll('.hero-img');
    heroImgEl.forEach((heroEl) => {
      if (heroEl !== null && heroEl !== undefined
        && heroEl.src !== undefined) {
        if (heroEl?.classList.contains('hidden')) {
          heroEl.src = landingHeroes[heroIndex].imageUrl;
          heroEl.classList.remove('hidden');
        } else {
          heroEl.classList.add('hidden');
        }
      }
    });

    const heroTitleEl = document.getElementById('hero-title');
    if (heroTitleEl !== null && heroTitleEl !== undefined) {
      const { language } = i18n;
      if (['русский', 'українська'].includes(language) && landingHeroes[heroIndex]?.translations) {
        heroTitleEl.innerText = landingHeroes[heroIndex]
          .translations[langAbbreviation[language]].name;
      } else {
        heroTitleEl.innerText = landingHeroes[heroIndex].name;
      }
    }

    heroTitleEl.setAttribute('data-index', heroIndex);
    document.querySelectorAll('li.item.selected').forEach((el) => {
      el.classList.remove('selected');
    });
    e.target.classList.add('selected');
  };

  return (
    <div className="landing-section">
      <div className="hero">
        <img src={landingHeroes[0].imageUrl} alt="croissant" className="hero-img" />
        <img src={landingHeroes[0].imageUrl} alt="croissant" className="hero-img hidden" />

        <div className="item-info-wrap">
          <h2 className="title" id="hero-title" data-index="0">
            {' '}
            {(() => {
              const { language } = i18n;
              if (['русский', 'українська'].includes(language) && landingHeroes[0]?.translations) {
                return landingHeroes[0]
                  .translations[langAbbreviation[language]].name;
              }
              return landingHeroes[0].name;
            })()}

          </h2>
          <Link id="hero-to-menu-btn" to="/menu">{t('landing.menu-btn')}</Link>
          {/* <button id="hero-to-menu-btn" type="button">To Menu</button> */}
        </div>
        <div className="image-slider-wrap">
          <ul className="image-slider" onClick={slideshowNav}>
            <li className="item selected" data-index="0" />
            <li className="item" data-index="1" />
            <li className="item" data-index="2" />
            <li className="item" data-index="3" />
            <li className="item" data-index="4" />
          </ul>
        </div>
      </div>
      <div className="subhero-wrap">
        <div className="bg" />
        <div className="bg bg2" />
        <div className="bg bg3" />

        <div className="subhero">
          <h3 className="title">
            OfKors
            <span>{' European '}</span>
            {`Bakery ${t('landing.offers')}`}
          </h3>
          <ul className="features-lst">
            <li className="feature">
              <img src="./assets/images/icons/cutlery-plate-svgrepo-com.svg" className="icon" alt="" />
              <span className="text">{t('landing.dine-in')}</span>
            </li>
            <li className="feature">
              <img src="./assets/images/icons/croissant-svgrepo-com.svg" className="icon croissant" alt="" />
              <span className="text">{t('landing.quality')}</span>
            </li>
            <li className="feature">
              <img src="./assets/images/icons/cupcake-dessert-svgrepo-com.svg" className="icon" alt="" />
              <span className="text">{t('landing.desserts')}</span>
            </li>
          </ul>
          <div className="doordash-button-wrap">
            <button
              id="doordash-link-btn"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                window.open('https://www.doordash.com/store/ofkors-bakery-sarasota-1163262/?pickup=false', '_blank');
              }}
            >
              <div className="logo" />
              <span>{t('landing.doordash')}</span>
            </button>
          </div>
        </div>
      </div>

      <LanguageSelector />
    </div>
  );
}

/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const { MAPS_API } = require('../../../config');

export default function Footer() {
  const { t } = useTranslation();

  const [contactInfo, setContactInfo] = useState({
    phone: '(941)552-9717',
    email: 'BlackSea41a@gmail.com',
    facebook: 'https://www.facebook.com/OfKors-Bakery-on-Cattlemen-138007417031393/',
  });
  const [operationHours, setOperationHours] = useState({});

  const googleMap = (
    <iframe
      className="map bee-ridge"
      title="map-main"
      frameBorder="0"
      scrolling="no"
      marginHeight="0"
      marginWidth="0"
      src={`https://www.google.com/maps/embed/v1/place?key=${MAPS_API}&q=OfKors+European+Bakery,Sarasota+Florida&zoom=15`}
    >
      <a href="https://www.gps.ie/farm-gps/">GPS Navigation</a>
    </iframe>
  );

  // Change map source
  const toggleMapSource = (url) => {
    const maps = document.querySelectorAll('iframe.map');
    maps.forEach((map) => {
      map.setAttribute('src', url);
    });
  };

  // ComponentDidMount
  useEffect(() => {
    axios.get('/fixedData')
      .then((res) => {
        const { data } = res;
        setContactInfo(data.contact);
        setOperationHours(data.hours);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <footer className="footer">
      <div className="footer-dimmer">
        <section className="map-main">
          {googleMap}
        </section>
        <section className="location-wrap">
          <section className="section address">
            <div className="text-wrap">
              <h3 className="title">{t('footer.titles.address')}</h3>
              <p className="address address-line">3945 Cattlemen Rd, Sarasota, Fl 34241</p>
            </div>
          </section>
          <section className="section locations">
            <div className="text-wrap">
              <h3 className="title">{t('footer.titles.locations')}</h3>
            </div>
            <button
              className="map-btn bee-ridge"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const addressBar = document.querySelector('.address-line');
                addressBar?.classList.remove('main-street');
                addressBar.innerText = '3945 Cattlemen Rd, Sarasota, Fl 34241';
                const url = `https://www.google.com/maps/embed/v1/place?key=${MAPS_API}&q=OfKors+European+Bakery,Sarasota+Florida&zoom=15`;
                toggleMapSource(url);
              }}
            >
              {t('footer.subtitles.this')}
            </button>
            <button
              className="map-btn main-street"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const addressBar = document.querySelector('.address-line');
                addressBar?.classList.add('main-street');
                addressBar.innerText = '1359 Main Street, Sarasota, Fl 34236';
                const url = `https://www.google.com/maps/embed/v1/place?key=${MAPS_API}&q=OfKors+Bakery,Sarasota+Florida&zoom=15`;
                toggleMapSource(url);
              }}
            >
              {t('footer.subtitles.downtown')}
            </button>
            <div className="map-mobile">
              {googleMap}
            </div>
          </section>
        </section>
        <section className="section contact">
          <div className="text-wrap">
            <h3 className="title">{t('footer.titles.contact')}</h3>
            <h4 className="subtitle">{`${t('footer.subtitles.email')}:`}</h4>
            <a className="link" href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
            <h4 className="subtitle" style={{ marginTop: '1vh' }}>{`${t('footer.subtitles.phone')}:`}</h4>
            <a className="text-body" href={`tel:${contactInfo.phone}`} style={{ textDecoration: 'none' }}>
              <i className="fa-solid fa-phone icon" />
              {contactInfo.phone}
            </a>
          </div>
          <a id="downtown-link" href="https://ofkorsbakery.com/" target="_blank" rel="noreferrer">
            <span>{t('footer.subtitles.downtown-link')}</span>
            <div className="logo-wrap">
              <div className="logo" />
            </div>
          </a>
        </section>
        <section className="section hours">
          <div className="text-wrap">
            <h3 className="title">{t('footer.titles.hours')}</h3>
            <ul className="hours-of-operation">
              {Object.keys(operationHours).map((day, i) => {
                const time = operationHours[day];
                let classList = 'day';
                if (day === 'saturday' || day === 'sunday') {
                  classList += ' weekend';
                }
                if (i + 1 === new Date().getDay()) {
                  classList += ' today';
                }

                // Helper : 9:5 -> 09:05,
                // eslint-disable-next-line no-confusing-arrow
                const timeConverter = (digit) => digit < 10 ? `0${digit}` : digit;
                const dayEl = !classList.includes('weekend') ? `${t(`footer.subtitles.week-days.${day}`)}: `
                + `${timeConverter(time.from.hour)}:${timeConverter(time.from.minute)} - ${timeConverter(time.to.hour)}:${timeConverter(time.to.minute)}`
                  : (
                    <>
                      <span>{`${t(`footer.subtitles.week-days.${day}`)}: `}</span>
                      {!time.closed ? `${timeConverter(time.from.hour)}:${timeConverter(time.from.minute)}`
                      + ` - ${timeConverter(time.to.hour)}:${timeConverter(time.to.minute)}`
                        : <span className="closed">{t('footer.subtitles.special-days.closed')}</span>}
                    </>
                  );

                return (
                  <li className={classList} key={i}>
                    {dayEl}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </footer>
  );
}

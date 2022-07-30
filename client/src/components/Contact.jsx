/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

export default function Contact() {
  const { t } = useTranslation();

  const [contactInfo, setContactInfo] = useState({
    phone: '(941)552-9717',
    email: 'BlackSea41a@gmail.com',
    facebook: 'https://www.facebook.com/OfKors-Bakery-on-Cattlemen-138007417031393/',
  });

  const submitQuestion = (e) => {
    e.preventDefault();
    const tooltip = document.querySelector('p.warning');

    const nameEl = document.querySelector('#input-name');
    const phoneEl = document.querySelector('#input-phone');
    const emailEl = document.querySelector('#input-email');
    const questionEl = document.querySelector('#input-message');

    let emptyInputsExist = false;
    // Clear placeholders
    [nameEl, phoneEl, emailEl, questionEl].forEach((el) => {
      el.placeholder = '';
    });

    [nameEl, questionEl].forEach((el) => {
      if (el.value.trim().length === 0) {
        el.placeholder = t('reach-out.required');
        tooltip.style.visibility = 'visible';
        tooltip.innerText = `* ${t('reach-out.required-placeholder')}`;
        emptyInputsExist = true;
      }
    });

    const name = nameEl.value.trim();
    const phone = phoneEl.value.trim();
    const email = emailEl.value.trim();
    const question = questionEl.value.trim();

    if (email === '' && phone === '') {
      phoneEl.placeholder = t('reach-out.required-contact-placeholder');
      emailEl.placeholder = t('reach-out.required-contact-placeholder');
      tooltip.style.visibility = 'visible';
      tooltip.innerText = `* ${t('reach-out.required-placeholder')}`;
      emptyInputsExist = true;
    }

    if (emptyInputsExist) {
      return;
    }

    axios.post('/questions', {
      name, phone, email, question,
    })
      .then(() => {
        tooltip.style.visibility = 'visible';
        tooltip.innerText = `* ${t('reach-out.submitted')}!`;
      })
      .catch((err) => {
        console.log(err);
        tooltip.style.visibility = 'visible';
        tooltip.innerText = '* Internal error: please try again later, or reach out directly';
      });
  };

  // ComponentDidMount
  useEffect(() => {
    axios.get('/fixedData?field=contact')
      .then((res) => setContactInfo(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="reach-out-section">

      <div className="hero-wrap">
        <div className="hero">
          <h1 className="title">{t('reach-out.hero')}</h1>
          <a href={`tel:${contactInfo.phone}`} style={{ textDecoration: 'none' }}>{contactInfo.phone}</a>
          <a className="email-link" href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          <a className="messenger-link" href={contactInfo.facebook} target="_blank" rel="noreferrer">
            {'Facebook '}
            <i className="fa-brands fa-facebook-messenger icon" />
          </a>
        </div>
      </div>
      <div className="reach-out-form-wrap">
        <form action="">
          <label htmlFor="input-name">
            <div className="label-text-wrap">
              <i className="fa-solid fa-user icon" />
              <span>{t('reach-out.form.name')}</span>
            </div>

            <input type="text" id="input-name" />
          </label>
          <label htmlFor="input-phone">
            <div className="label-text-wrap">
              <i className="fa-solid fa-phone icon" />
              <span>{t('reach-out.form.phone')}</span>
            </div>
            <input type="text" id="input-phone" />
          </label>
          <label htmlFor="input-email">
            <div className="label-text-wrap">
              <i className="fa-solid fa-envelope icon" />
              <span>{t('reach-out.form.email')}</span>
            </div>
            <input type="text" id="input-email" />
          </label>
          <label htmlFor="input-message">
            <div className="label-text-wrap">
              <i className="fa-solid fa-comment icon" />
              <span>{t('reach-out.form.message')}</span>
            </div>
            <textarea id="input-message" cols="30" rows="10" />
          </label>
          <div className="submit-wrap">
            <p className="warning" style={{ visibility: 'hidden' }}>{`*${t('reach-out.required-contact')}`}</p>
            <button type="submit" id="reach-out-submit-btn" onClick={submitQuestion}>{t('reach-out.form.submit')}</button>
          </div>
        </form>
      </div>

    </div>
  );
}

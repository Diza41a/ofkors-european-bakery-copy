/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminLogin() {
  const navigate = useNavigate();
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    const passwordInput = document.getElementById('admin-password-input');
    if (e.target.classList.contains('show-password')) {
      e.target.classList.remove('show-password');
      passwordInput.type = 'password';
    } else {
      e.target.classList.add('show-password');
      passwordInput.type = 'text';
    }
  };

  // Request credentials to be sent to Admin Email
  const sendCredentials = () => {
    const tooltip = document.getElementById('tooltip');
    axios.get('/credentials')
      .then(() => {
        tooltip.innerText = '* Credentials sent to admin email!';
      })
      .catch((err) => {
        console.log(err);
        tooltip.innerText = '* Error sending credentials, try again or contact support...';
      })
      .finally(() => {
        tooltip.style.display = 'initial';
      });
  };

  const authenticate = (e) => {
    e.preventDefault();
    const emailEl = document.getElementById('admin-email-input');
    const passwordEl = document.getElementById('admin-password-input');

    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    axios.post('/authenticate', { email, password })
      .then(() => {
        navigate('/admin-dashboard');
      })
      .catch((err) => {
        console.log(err);
        if (err.request.status === 401 || err.request.status === 422) {
          const tooltip = document.getElementById('tooltip');
          tooltip.innerText = '* Invalid credentials, try again!';
          tooltip.style.display = 'initial';
        }
      });
  };

  return (
    <>
      <section className="admin-login-section">
        <div className="login-section-wrap">
          <div className="login-section">
            <Link to="/" id="back-to-main-btn">
              <i className="fa-solid fa-arrow-left-long icon" />
              {'  Back to Website'}
            </Link>

            <form id="admin-login-form">
              <h3 className="title">Admin Login</h3>

              <label htmlFor="admin-email-input">
                <div className="label-text-wrap">
                  <i className="fa-solid fa-user icon" />
                  <span>Email</span>
                </div>
                <input type="text" id="admin-email-input" />
              </label>
              <label htmlFor="admin-password-input">
                <div className="label-text-wrap">
                  <i className="fa-solid fa-eye icon eye" onClick={togglePasswordVisibility} />
                  <span>Password</span>
                </div>
                <input type="password" id="admin-password-input" />
              </label>

              <button type="button" id="password-mail-btn" onClick={sendCredentials}>Forgot Credentials?</button>

              <p id="tooltip" style={{ display: 'none' }} />

              <div className="submit-wrap">
                <button type="submit" id="reach-out-submit-btn" onClick={authenticate}>Login</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* For now, background attributed to:
    Momika Shrestha -> https://codepen.io/Momika/pen/ydaWmQ */}
      <section className="sticky">
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
  );
}

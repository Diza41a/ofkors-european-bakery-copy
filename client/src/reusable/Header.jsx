import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();

  const hideBurgerMenu = () => {
    const modal = document.querySelector('.burger-menu');
    modal.style.display = 'none';
  };

  return (
    <>
      <header className="burger-menu">
        <div className="logo-wrap">
          <div className="logo" />
        </div>
        <NavLink to="/about" className="nav-btn" onClick={hideBurgerMenu}>{t('header.about')}</NavLink>
        <NavLink to="/menu" className="nav-btn" onClick={hideBurgerMenu}>{t('header.menu')}</NavLink>
        <NavLink to="/contact" className="nav-btn" onClick={hideBurgerMenu}>
          <span>?</span>
          {t('header.contact')}
        </NavLink>
        <NavLink to="/admin-dashboard" className="nav-btn">
          {/* <i className="fa-solid fa-lock" /> */}
          {t('header.admin')}
        </NavLink>
        {/* Hide burger menu */}
        <button
          type="button"
          id="burger-close-btn"
          onClick={(e) => {
            e.preventDefault();
            const modal = document.querySelector('.burger-menu');
            modal.style.display = 'none';
          }}
        >
          X
        </button>
      </header>

      <header className="header">
        <div className="header-dimmer">
          <Link to="/" className="logo-wrap">
            <div className="logo" />
          </Link>

          <nav className="nav-mobile">
            <Link id="menu-btn" to="/menu" className="nav-btn">
              <i className="fa-solid fa-utensils icon" />
            </Link>
            {/* Display burger menu */}
            <button
              className="nav-btn"
              id="burger-btn"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                const modal = document.querySelector('.burger-menu');
                modal.style.display = 'flex';
              }}
            >
              <i className="fa-solid fa-bars icon" />
            </button>
          </nav>

          <nav className="nav-main">
            <NavLink to="about" className="nav-main-link">{t('header.about')}</NavLink>
            <NavLink to="menu" className="nav-main-link">{t('header.menu')}</NavLink>
            <NavLink to="contact" className="nav-main-link">
              <i className="fa-solid fa-question icon" />
              {` ${t('header.contact')}`}
            </NavLink>
            <NavLink to="/admin-dashboard" className="nav-main-link">{t('header.admin')}</NavLink>
          </nav>
        </div>
      </header>
    </>
  );
}

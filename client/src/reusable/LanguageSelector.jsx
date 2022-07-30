/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import * as React from 'react';
import i18n from '../i18n';

export default function LanguageSelector() {
  const toggleLanguage = (e) => {
    e.preventDefault();
    if (!e.target?.classList.contains('lang-btn')) {
      return;
    }
    i18n.changeLanguage(e.target?.getAttribute('data-language'));
    document.querySelector('.selected-lang')?.classList.remove('selected-lang');
    e.target?.classList.add('selected-lang');
  };
  return (
    <div className="language-selector" onClick={toggleLanguage}>
      {['українська', 'русский', 'english'].map((lang, i) => {
        const classList = `lang-btn ${lang === i18n.language ? 'selected-lang' : ''}`;

        return (
          <button type="button" className={classList} data-language={lang} key={i}>{lang[0] + lang[1]}</button>
        );
      })}
    </div>
  );
}

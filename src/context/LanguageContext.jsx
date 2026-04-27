import React, { createContext, useContext, useState, useEffect } from 'react';
import { languages } from '../util/lang';

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('elearning-language') || 'en';
    if (languages[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (languages[lang]) {
      setLanguage(lang);
      localStorage.setItem('elearning-language', lang);
    }
  };

  const t = (key) => {
    return languages[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
      texts: languages[language],
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
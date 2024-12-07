import React, { useState } from 'react';

function Settings() {
  const [language, setLanguage] = useState('English');
  const [darkMode, setDarkMode] = useState(false);

  // Translations for the settings labels
  const translations = {
    English: {
      heading: 'Settings',
      language: 'Language',
      selectLanguage: 'Select Language:',
      darkMode: 'Enable Dark Mode:',
    },
    French: {
      heading: 'Paramètres',
      language: 'Langue',
      selectLanguage: 'Choisir la langue :',
      darkMode: 'Activer le mode sombre :',
    },
    Spanish: {
      heading: 'Configuraciones',
      language: 'Idioma',
      selectLanguage: 'Seleccionar idioma:',
      darkMode: 'Activar modo oscuro:',
    },
  };

  // Handle language change
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    document.documentElement.lang = selectedLanguage === 'English' ? 'en' : 
                                      selectedLanguage === 'French' ? 'fr' : 'es';
    alert(`Language changed to ${selectedLanguage}`);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const isDarkMode = !darkMode;
    setDarkMode(isDarkMode);
    document.body.style.backgroundColor = isDarkMode ? '#2E2422' : '#fff';
    document.body.style.color = isDarkMode ? '#fff' : '#000';
  };

  // Get the translations for the current language
  const t = translations[language];

  return (
    <div className="Settings">
      <h1>{t.heading}</h1>

      {/* Language Settings */}
      <section>
        <h2>{t.language}</h2>
        <label htmlFor="languageSelect">{t.selectLanguage}</label>
        <select id="languageSelect" value={language} onChange={handleLanguageChange}>
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
        </select>
      </section>

      {/* Dark Mode Settings */}
      <section>
        <h2>{t.darkMode}</h2>
        <label htmlFor="darkModeToggle">{t.darkMode}</label>
        <input
          id="darkModeToggle"
          type="checkbox"
          checked={darkMode}
          onChange={toggleDarkMode}
        />
      </section>
    </div>
  );
}

export default Settings;


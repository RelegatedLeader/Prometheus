import React, { useState } from 'react';

function Settings() {
  const [language, setLanguage] = useState('English');
  const [darkMode, setDarkMode] = useState(false);

  // Text translations for UI elements
  const translations = {
    English: {
      title: 'Settings',
      language: 'Language',
      selectLanguage: 'Select Language:',
      nightMode: 'Night Mode',
      enableNightMode: 'Enable Night Mode:',
    },
    French: {
      title: 'Paramètres',
      language: 'Langue',
      selectLanguage: 'Choisir la langue:',
      nightMode: 'Mode Nuit',
      enableNightMode: 'Activer le mode nuit:',
    },
    Spanish: {
      title: 'Configuración',
      language: 'Idioma',
      selectLanguage: 'Seleccionar idioma:',
      nightMode: 'Modo Nocturno',
      enableNightMode: 'Activar el modo nocturno:',
    },
  };

  // Handle language change
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.style.backgroundColor = darkMode ? '#fff' : '#2E2422';
    document.body.style.color = darkMode ? '#000' : '#fff';
  };

  // Get current translations
  const currentText = translations[language];

  return (
    <div className="Settings">
      <h1>{currentText.title}</h1>

      {/* Language Settings */}
      <section>
        <h2>{currentText.language}</h2>
        <label htmlFor="languageSelect">{currentText.selectLanguage}</label>
        <select id="languageSelect" value={language} onChange={handleLanguageChange}>
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
        </select>
      </section>

      {/* Night Mode Settings */}
      <section>
        <h2>{currentText.nightMode}</h2>
        <label htmlFor="darkModeToggle">{currentText.enableNightMode}</label>
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

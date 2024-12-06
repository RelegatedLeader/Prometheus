import React, { useState } from 'react';

const translations = {
  English: {
    generalSettings: 'General Settings',
    privacySettings: 'Privacy Settings',
    accountSettings: 'Account Settings',
    theme: 'Theme:',
    language: 'Language:',
    enableNotifications: 'Enable Notifications',
    autoDeleteTimer: 'Message Auto-Delete Timer (minutes):',
    hideOnlineStatus: 'Hide Online Status',
    regenerateHash: 'Regenerate Hash',
    logout: 'Logout',
  },
  Spanish: {
    generalSettings: 'Configuración General',
    privacySettings: 'Configuración de Privacidad',
    accountSettings: 'Configuración de la Cuenta',
    theme: 'Tema:',
    language: 'Idioma:',
    enableNotifications: 'Habilitar Notificaciones',
    autoDeleteTimer: 'Temporizador de Autoeliminación de Mensajes (minutos):',
    hideOnlineStatus: 'Ocultar Estado En Línea',
    regenerateHash: 'Regenerar Hash',
    logout: 'Cerrar sesión',
  },
  French: {
    generalSettings: 'Paramètres Généraux',
    privacySettings: 'Paramètres de Confidentialité',
    accountSettings: 'Paramètres du Compte',
    theme: 'Thème:',
    language: 'Langue:',
    enableNotifications: 'Activer les Notifications',
    autoDeleteTimer: 'Minuteur de Suppression Automatique des Messages (minutes):',
    hideOnlineStatus: 'Cacher le Statut En Ligne',
    regenerateHash: 'Régénérer le Hash',
    logout: 'Déconnexion',
  },
};

function Settings() {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState(true);
  const [autoDeleteTimer, setAutoDeleteTimer] = useState(20); // Default 20 minutes
  const [hideOnlineStatus, setHideOnlineStatus] = useState(false);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    document.body.setAttribute('data-theme', e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleLogout = () => {
    alert('Logging out...');
    window.location.href = '/'; // Redirect to home or login
  };

  const handleRegenerateHash = () => {
    const newHash = Math.random().toString(36).substring(2, 15);
    alert(`Your new hash is: ${newHash}`);
  };

  const t = translations[language];

  return (
    <div className="Settings">
      <h1>{t.generalSettings}</h1>

      {/* General Settings */}
      <section>
        <h2>{t.generalSettings}</h2>
        <div>
          <label htmlFor="theme">{t.theme}</label>
          <select id="theme" value={theme} onChange={handleThemeChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label htmlFor="language">{t.language}</label>
          <select id="language" value={language} onChange={handleLanguageChange}>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            {t.enableNotifications}
          </label>
        </div>
      </section>

      {/* Privacy Settings */}
      <section>
        <h2>{t.privacySettings}</h2>
        <div>
          <label htmlFor="auto-delete-timer">{t.autoDeleteTimer}</label>
          <input
            id="auto-delete-timer"
            type="number"
            value={autoDeleteTimer}
            onChange={(e) => setAutoDeleteTimer(e.target.value)}
            min="1"
            max="60"
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={hideOnlineStatus}
              onChange={() => setHideOnlineStatus(!hideOnlineStatus)}
            />
            {t.hideOnlineStatus}
          </label>
        </div>
      </section>

      {/* Account Settings */}
      <section>
        <h2>{t.accountSettings}</h2>
        <div>
          <button onClick={handleRegenerateHash}>{t.regenerateHash}</button>
        </div>
        <div>
          <button onClick={handleLogout}>{t.logout}</button>
        </div>
      </section>
    </div>
  );
}

export default Settings;

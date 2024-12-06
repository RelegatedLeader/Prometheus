import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  English: {
    settings: 'Settings',
    messages: 'Messages',
    liveMessaging: 'Live Messaging',
    notes: 'Notes',
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
    settings: 'Configuración',
    messages: 'Mensajes',
    liveMessaging: 'Mensajería en Vivo',
    notes: 'Notas',
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
    settings: 'Paramètres',
    messages: 'Messages',
    liveMessaging: 'Messagerie en Direct',
    notes: 'Notes',
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

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('English');

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

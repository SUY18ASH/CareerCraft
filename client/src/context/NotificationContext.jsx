// src/context/NotificationContext.jsx
import React, { createContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notif, setNotif] = useState({ open: false, message: '', severity: 'info' });

  const showNotification = (message, severity = 'info') => {
    setNotif({ open: true, message, severity });
  };
  const handleClose = () => setNotif(n => ({ ...n, open: false }));

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <Snackbar open={notif.open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={notif.severity} sx={{ width: '100%' }}>
          {notif.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

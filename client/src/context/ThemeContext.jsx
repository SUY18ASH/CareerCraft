// src/context/ThemeContext.jsx
import React, { createContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'light');

  // set data-theme attribute on body
  useEffect(() => {
    document.body.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  }, [mode]);

  const toggleTheme = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: mode==='light' ? '#008080' : '#00e0ff' },
      secondary: { main: mode==='light' ? '#ff6b6b' : '#ff6b6b' },
      background: { default: mode==='light' ? '#f0f4f8' : '#0f172a' },
      text: { primary: mode==='light' ? '#1e293b' : '#e2e8f0' }
    }
  }), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

// src/themeOverrides.js
export const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: 8,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      },
    },
  },
  MuiTypography: {
    defaultProps: {
      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    },
  },
};

import { createTheme } from '@mui/material/styles';

/**
 * Official MUI Material Design 3 (M3) Theme Configuration
 */
const m3Theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#006d44', // M3 Emerald 700
      light: '#38a06c',
      dark: '#004026',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4e6355',
      light: '#7e9686',
      dark: '#223428',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8faf8',
      paper: '#ffffff',
    },
    text: {
      primary: '#191c1a',
      secondary: '#404943',
    },
    error: {
      main: '#ba1a1a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, tracking: '-0.02em' },
    h2: { fontWeight: 700, tracking: '-0.01em' },
    h3: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100, // M3 Full Pill Shape
          padding: '10px 24px',
          fontWeight: 600,
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 28, // M3 Extra Large Shape
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 28,
        },
      },
    },
  },
});

export default m3Theme;

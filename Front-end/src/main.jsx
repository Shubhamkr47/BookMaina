import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.jsx';
import './index.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3567b7' },
    secondary: { main: '#b7794f' },
    background: {
      default: '#f6f9fd',
      paper: '#ffffff',
    },
    text: {
      primary: '#1d2a3a',
      secondary: '#5e7187',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: '"Segoe UI", "Trebuchet MS", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.03em' },
    h3: { fontWeight: 700, letterSpacing: '-0.03em' },
    h4: { fontWeight: 700, letterSpacing: '-0.03em' },
    h5: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at top left, rgba(201, 228, 255, 0.7), transparent 32%), radial-gradient(circle at top right, rgba(255, 243, 219, 0.7), transparent 28%), linear-gradient(180deg, #fbfdff 0%, #f3f8ff 52%, #eef3f9 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(105, 144, 185, 0.18)',
          boxShadow: '0 20px 60px rgba(46, 80, 120, 0.10)',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          minHeight: 44,
        },
        containedPrimary: {
          boxShadow: '0 12px 30px rgba(53, 103, 183, 0.20)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.72)',
          color: '#1d2a3a',
          borderBottom: '1px solid rgba(105, 144, 185, 0.18)',
          backdropFilter: 'blur(18px)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0C3A6B',
      light: '#2A7BE4',
      dark: '#08264A',
    },
    secondary: {
      main: '#5DC8A0',
    },
    background: {
      default: '#F0F4F8',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: 13,
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;

const theme = {
colors: {
    primary: "#1976d2",
    secondary: "#9c27b0",
    background: "#f5f5f5",
    surface: "#fff",
    error: "#d32f2f",
    text: {
    primary: "#212121",
    secondary: "#757575",
    disabled: "#bdbdbd",
    },
  },
  spacing: (factor) => `${0.25 * factor}rem`,
typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  borderRadius: 8,
};

export default theme;
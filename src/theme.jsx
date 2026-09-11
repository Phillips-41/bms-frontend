import { createTheme } from '@mui/material/styles';
import { createContext,useState, useMemo } from 'react';

export const tokens = (mode) => ({

   ...(mode === "dark"
    ?{
  grey: {
    100: "#ffffff",
    200: "#f5f5f5",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  primary: {
    100: "#000",
    200: "#f9f9f9",
    300: "1px solid rgba(255, 255, 255, 0.25)",
    400: "#f0f0f0",
    500: "#e0e0e0",
    600: "linear-gradient(to right, #008B8B, #00FFFF, #008B8B)",
    700: "dark",
    800: "1px solid rgba(218, 218, 143, 0.66)",
    900: "black",
  },
  greenAccent: {
    100: "#dbf5ee",
    200: "#b7ebde",
    300: "#94e2cd",
    400: "#70d8bd",
    500: "#4cceac",
    600: "#3da58a",
    700: "#2e7c67",
    800: "#1e5245",
    900: "#0f2922",
  },
  redAccent: {
    100: "#ffebee",
    200: "#ffcdd2",
    300: "#ef9a9a",
    400: "#ef5350",
    500: "#f44336",
    600: "#e53935",
    700: "#d32f2f",
    800: "#c62828",
    900: "#b71c1c",
  },
  blueAccent: {
    100: "#1A2526", // Darkest Blue
    200: "#2E4057", // Dark Blue
    300: "#3F7CAC", // Medium Blue
    400: "#A3BFFA", // Light Blue
    500: "#6870fa",
    600: "#868dfb",
    700: "#a4a9fc",
    800: "#c3c6fd",
    900: "#e1e2fe",
  }
}:{
  grey: {
    100: "#ffffff",
    200: "#f5f5f5",
    300: "#e0e0e0",
    400: "#bdbdbd",
    500: "#9e9e9e",
    600: "#757575",
    700: "#616161",
    800: "#424242",
    900: "#212121",
  },
  primary: {
    100: "#ffffff",
    200: "#191C24",
    300: "1px solid rgba(0, 0, 0, 0.25)",
    400: "#f0f0f0",
    500: "#e0e0e0",
    600: "linear-gradient(to right, #003265, #003265, #003265)",
    700: "light",
    800:"1px solid rgba(0, 0, 0, 0.66)",
    900: "white",
  },
  greenAccent: {
    100: "#dbf5ee",
    200: "#b7ebde",
    300: "#94e2cd",
    400: "#70d8bd",
    500: "#4cceac",
    600: "#3da58a",
    700: "#2e7c67",
    800: "#1e5245",
    900: "#0f2922",
  },
  redAccent: {
    100: "#ffebee",
    200: "#ffcdd2",
    300: "#ef9a9a",
    400: "#ef5350",
    500: "#f44336",
    600: "#e53935",
    700: "#d32f2f",
    800: "#c62828",
    900: "#b71c1c",
  },
  blueAccent: {
    100: "#1A2526", // Darkest Blue
    200: "#2E4057", // Dark Blue
    300: "#3F7CAC", // Medium Blue
    400: "#A3BFFA", // Light Blue
    500: "#6870fa",
    600: "#868dfb",
    700: "#a4a9fc",
    800: "#c3c6fd",
    900: "#e1e2fe",
  }
})
});

export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {  
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
      primary: {
        main: colors.blueAccent[300], // Medium Blue (#3F7CAC) for primary actions
        contrastText: colors.grey[100], // White text on primary
      },
      secondary: {
        main: colors.blueAccent[200], // Dark Blue (#2E4057) for secondary actions
        contrastText: colors.grey[100], // White text on secondary
      },
      neutral: {
        dark: colors.grey[700],
        main: colors.grey[500],
        light: colors.grey[100],
      },
      background: {
        default: "#0a0e17",
        paper: "#111827",
      },
      text: {
        primary: "#ffffff",
        secondary: "#9ca3af",
      },
      accent: {
        main: colors.blueAccent[100], // Darkest Blue (#1A2526) for accents
      },
    }:{
       primary: {
        main: colors.blueAccent[300], // Medium Blue (#3F7CAC) for primary actions
        contrastText: colors.grey[100], // White text on primary
      },
      secondary: {
        main: colors.blueAccent[200], // Dark Blue (#2E4057) for secondary actions
        contrastText: colors.grey[100], // White text on secondary
      },
      neutral: {
        dark: colors.grey[700],
        main: colors.grey[500],
        light: colors.grey[100],
      },
      background: {
        default: "#f5f5f5",
        paper: "#ffffff",
      },
      text: {
        primary: colors.blueAccent[100], // Darkest Blue (#1A2526) for main text
        secondary: colors.blueAccent[200], // Dark Blue (#2E4057) for secondary text
      },
      accent: {
        main: colors.blueAccent[100], // Darkest Blue (#1A2526) for accents
      },
    })
    },
    typography: {
      fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 16,
        marginBottom: 6,
      },
      h6: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 14,
      },
      h7: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 12,
      },
      h8: {
        fontFamily: ["Source Sans Pro", "sans-serif"].join(","),
        fontSize: 10,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
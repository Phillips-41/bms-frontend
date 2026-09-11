// ReportsBar.styles.js
// Centralized style definitions for ReportsBar.jsx
// All functions take (theme, colors) so they stay in sync with your MUI theme

export const getContainerStyles = (theme) => ({
  width: "100%",
  flexWrap: "wrap",
  overflow: "hidden",
  "& > *": {
    flexShrink: 1,
    minWidth: 0,
  },
  [theme.breakpoints.down("sm")]: {
    flexWrap: "wrap",
    "& > *": {
      flexBasis: "calc(50% - 0.5rem)",
      minWidth: "unset",
      marginBottom: "0.5rem",
    },
    "& > :last-child, & > :nth-last-child(2)": {
      flexBasis: "100%",
      marginBottom: 0,
    },
  },
  [theme.breakpoints.down(400)]: {
    "& > *": {
      flexBasis: "100%",
    },
  },
});

// Shared size profile for the filter Autocompletes (State/Zone/Circle/Division/Area)
// Fix: removed the tight maxWidth clamp + added flexGrow so the selected value
// isn't cut off. minWidth still keeps it from collapsing too small.
export const autocompleteSizes = {
  width: "auto",
  minWidth: {
    xl: "9rem",
    lg: "9rem",
    md: "7rem",
    sm: "6.5rem",
    xs: "6rem",
  },
  maxWidth: {
    xl: "13rem",
    lg: "12rem",
    md: "11rem",
    sm: "10rem",
    xs: "9rem",
  },
};

export const getTextFieldStyles = (colors) => ({
  "& .MuiInputBase-root": {
    height: "1.75rem",
    color: colors.primary[200],
    border: `1px solid #75767B`,
  },
  "& .MuiInputBase-input": {
    fontSize: {
      xl: "0.8125rem",
      lg: "0.7875rem",
      md: "0.7625rem",
      sm: "0.7375rem",
      xs: "0.7125rem",
    },
    // Fix: allow the full value to render instead of clipping it
    overflow: "visible",
    textOverflow: "unset",
    whiteSpace: "nowrap",
//     width: "auto",           // <-- input sizes to its text
//   minWidth: "3ch",
    "&::placeholder": {
      color: colors.primary[200],
      opacity: 1,
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: {
      xl: "0.8125rem",
      lg: "0.7875rem",
      md: "0.7625rem",
      sm: "0.7375rem",
      xs: "0.7125rem",
    },
  },
});

export const autocompleteBorderStyles = {
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#75767B",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#75767B",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#75767B",
  },
};

export const inputStyles = {
  fontSize: {
    xl: "0.8125rem",
    lg: "0.7875rem",
    md: "0.7625rem",
    sm: "0.7375rem",
    xs: "0.7125rem",
  },
  padding: "0.125rem 0.25rem !important",
};
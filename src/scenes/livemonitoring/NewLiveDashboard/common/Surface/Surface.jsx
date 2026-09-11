import Paper from "@mui/material/Paper";
import "./Surface.css";

/**
 * Surface — MUI Paper styled as the standard dashboard card.
 * Fills its grid cell; parent controls placement.
 */
export default function Surface({ children, className = "", component = "section", sx = {} }) {
  return (
    <Paper
      component={component}
      className={`surface ${className}`}
      square={false}
      sx={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        p: "5px 7px",
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

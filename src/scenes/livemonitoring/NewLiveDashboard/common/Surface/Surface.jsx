import Paper from "@mui/material/Paper";
import "./Surface.css";

/**
 * Surface — MUI Paper styled as the standard dashboard card.
 * Fills its grid cell; parent controls placement.
 * Padding: tighter on tablet so upper cards take less space.
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
        overflow: { xs: "visible", sm: "hidden" },
        p: {
          xs: "10px 12px",
          sm: "5px 7px",
          md: "5px 7px",
          lg: "5px 7px",
          xl: "5px 7px",
        },
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

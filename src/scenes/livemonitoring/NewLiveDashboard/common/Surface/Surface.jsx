import Paper from "@mui/material/Paper";
import "./Surface.css";

/**
 * Surface — MUI Paper styled as the standard dashboard card.
 * Fills its grid cell; parent controls placement.
 * Padding scales by breakpoint; md+ keeps desktop values.
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
          sm: "7px 9px",
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

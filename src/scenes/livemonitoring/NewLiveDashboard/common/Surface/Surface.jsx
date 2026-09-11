import Paper from "@mui/material/Paper";
import "./Surface.css";

/**
 * Surface — MUI Paper styled as the standard dashboard card.
 * `className` receives the grid-placement class of the owning panel.
 */
export default function Surface({ children, className = "", component = "section" }) {
  return (
    <Paper component={component} className={`surface ${className}`} square={false}>
      {children}
    </Paper>
  );
}

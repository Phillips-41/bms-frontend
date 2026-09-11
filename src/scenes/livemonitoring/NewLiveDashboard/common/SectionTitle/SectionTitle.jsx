import Box from "@mui/material/Box";
import "./SectionTitle.css";

/**
 * SectionTitle — heading for every operational panel.
 * @param {ReactNode} aside  optional status chip rendered on the right
 */
export default function SectionTitle({ children, aside }) {
  return (
    <Box className="section-heading">
      <Box className="section-heading-main">
        <span className="accent-line" />
        <h2>{children}</h2>
      </Box>
      {aside}
    </Box>
  );
}

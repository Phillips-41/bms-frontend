
import { Box } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Surface from "../common/Surface/Surface";
import SectionTitle from "../common/SectionTitle/SectionTitle"; 

export function BarChart({ title, bars }) {
  return (
    <Surface className="chart-card">
      <SectionTitle>{title}</SectionTitle>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          minHeight: 0,
          flex: 1,
          alignItems: "flex-end",
          justifyContent: "space-around",
          gap: "8px",
          px: "6%",
          pt: "6px",
          borderBottom: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: "6px 0 12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: "none",
            "& i": {
              borderTop: "1px dashed color-mix(in oklab, var(--border) 65%, transparent)",
            },
          }}
        >
          <i />
          <i />
          <i />
        </Box>
        {bars.map((bar) => (
          <Box
            key={bar.label}
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              width: "30%",
              height: "100%",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "flex-end",
              "& b": {
                mt: "3px",
                color: "var(--muted-foreground)",
                fontSize: "10px",
              },
            }}
          >
            <Box
              component="span"
              sx={{
                mb: "3px",
                color: "var(--foreground)",
                fontSize: "10px",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {bar.value}
            </Box>
            <Tooltip title={`${bar.label}: ${bar.value}`} arrow placement="top">
              <Box
                tabIndex={0}
                sx={{
                  position: "relative",
                  width: "min(44px, 75%)",
                  minHeight: "4px",
                  height: `${bar.height}%`,
                  borderRadius: "3px 3px 0 0",
                  background: "var(--primary)",
                  transition: "filter 140ms, transform 140ms",
                  transformOrigin: "bottom",
                  "&:hover, &:focus": {
                    filter: "saturate(1.25)",
                    transform: "scaleY(1.02)",
                    outline: "none",
                  },
                }}
              />
            </Tooltip>
            <b>{bar.label}</b>
          </Box>
        ))}
      </Box>
    </Surface>
  );
}
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
          minHeight: { xs: 120, sm: 0, md: 0 },
          flex: 1,
          alignItems: "flex-end",
          justifyContent: "space-around",
          gap: { xs: "12px", sm: "8px", md: "8px" },
          px: { xs: "4%", sm: "6%", md: "6%" },
          pt: { xs: "10px", sm: "6px", md: "6px" },
          borderBottom: "1px solid var(--border)",
          overflow: { xs: "visible", sm: "hidden" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: { xs: "10px 0 16px", sm: "6px 0 12px", md: "6px 0 12px" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: "none",
            "& i": {
              borderTop:
                "1px dashed color-mix(in oklab, var(--border) 65%, transparent)",
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
                mt: { xs: "4px", sm: "3px", md: "3px" },
                color: "var(--muted-foreground)",
                fontSize: { xs: "12px", sm: "11px", md: "10px" },
              },
            }}
          >
            <Box
              component="span"
              sx={{
                mb: { xs: "4px", sm: "3px", md: "3px" },
                color: "var(--foreground)",
                fontSize: { xs: "12px", sm: "11px", md: "10px" },
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
                  width: {
                    xs: "min(56px, 80%)",
                    sm: "min(48px, 75%)",
                    md: "min(44px, 75%)",
                  },
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

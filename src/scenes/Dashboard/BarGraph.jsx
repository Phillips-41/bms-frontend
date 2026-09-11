import React, { useRef, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { tokens } from "../../theme";

Chart.register(ChartDataLabels);



const totalData = {
  Bhandup: { Thane: 63, Vashi: 2 },
  Jalgaon: { Dhule: 89, Jalagon: 184, Nandurbar: 60 },
  Kalyan: { Palghar: 40, Vasai: 2, 'Kalyan Circle 1': 23, 'Kalyan Circle 2': 29 },
  Konkan: { Ratnagiri: 58, Sindhudurg: 31 },
  Nashik: { Ahilyanagar: 237, Malegaeon: 94, Nashik : 140 },
};

const colors = {
  Bhandup: "#5ac7cdff",
  Jalgaon: "#d2df41ff",
  Kalyan: "#9fa0d6ff",
  Konkan: "#800080",
  Nashik: "#6b33d3ff",
};

const BarGraph = ({data}) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
    const theme = useTheme();
  const color = tokens(theme.palette.mode);
  useEffect(() => {
    const circles = [];
    const presentCounts = [];
    const remainingCounts = []; // Total - Present
    const circleColors = [];
    const zoneIndices = [];
    const zoneTotals = {};
    const zoneTotalCounts = {};

    Object.keys(data).forEach((zone) => {
      let presentTotal = 0;
      let totalCount = 0;
     Object.keys(data[zone]).forEach((circle) => {
  try {
    circles.push(circle);
    const present = data[zone][circle];
    const total = totalData[zone][circle];
    const remaining = total - present;

    presentCounts.push(present);
    remainingCounts.push(remaining);
    circleColors.push(colors[zone]);
    presentTotal += present;
    totalCount += total;
    zoneIndices.push(zone);
  } catch (error) {
    console.error(`Error processing circle '${circle}' in zone '${zone}':`, error);
    // Optionally continue with next iteration or handle gracefully
  }
});
      zoneTotals[zone] = presentTotal;
      zoneTotalCounts[zone] = totalCount;
    });

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: circles,
            datasets: [
              {
                label: "Present Count",
                data: presentCounts,
                backgroundColor: circleColors.map((color) => `${color}CC`), // 80% opacity
                borderColor: circleColors,
                borderWidth: 1,
              },
              {
                label: "Remaining Count",
                data: remainingCounts,
                backgroundColor: circleColors.map((color) => `${color}33`), // 20% opacity
                borderColor: circleColors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label || "";
                    const value = context.parsed.y;
                    const total =
                      context.datasetIndex === 0
                        ? value + remainingCounts[context.dataIndex]
                        : presentCounts[context.dataIndex] + value;

                    if (context.datasetIndex === 0) {
                      return `Present: ${value} / ${total}`;
                    } else {
                      return `Remaining: ${value} / ${total}`;
                    }
                  },
                },
              },
              datalabels: {
                anchor: "end",
                align: "top",
                formatter: (value, context) => {
                  // Only show label for remaining count bars (second dataset)
                  if (context.datasetIndex === 1) {
                    const present = presentCounts[context.dataIndex];
                    const total = present + value;
                    return `${present}/${total}`;
                  }
                  return "";
                },
                color: color.primary[200],
                font: {
                  weight: "bold",
                  size: 10,
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Circles",
                  color: color.primary[200],
                  font: {
                    size: 12,
                  },
                },
                ticks: {
                  autoSkip: false,
                  font: {
                    size: 10,
                  },
                },
                grid: { display: false },
                stacked: true,
              },
              y: {
                title: { display: false },
                beginAtZero: true,
                max: 300,
                stacked: true,
                ticks: {
                  font: {
                    size: 10,
                  },
                },
              },
            },
            layout: {
              padding: {
                top: 50,
              },
            },
          },
          plugins: [
            {
              id: "zoneNamesWithColor",
              afterDraw(chart) {
                const { ctx, scales: { x, y }, data } = chart;
                ctx.save();
                ctx.font = "bold 10px Arial";
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";

                let lastZone = null;
                let zoneStartIndex = 0;
                zoneIndices.forEach((zone, index) => {
                  if (zone !== lastZone && lastZone !== null) {
                    const startX = x.getPixelForTick(zoneStartIndex);
                    const endX = x.getPixelForTick(index - 1);
                    const xPos = (startX + endX) / 2;
                    ctx.fillStyle = colors[lastZone];
                    ctx.fillRect(xPos - 35, y.top - 18, 8, 8);
                    ctx.fillStyle =  color.primary[200];
                    ctx.fillText(
                      `${lastZone}: ${zoneTotals[lastZone]}/${zoneTotalCounts[lastZone]}`,
                      xPos - 25,
                      y.top - 14
                    );
                    zoneStartIndex = index;
                  }
                  lastZone = zone;
                });
                const startX = x.getPixelForTick(zoneStartIndex);
                const endX = x.getPixelForTick(data.labels.length - 1);
                const xPos = (startX + endX) / 2;
                ctx.fillStyle = colors[lastZone];
                ctx.fillRect(xPos - 35, y.top - 18, 8, 8);
                ctx.fillStyle = color.primary[200];
                ctx.fillText(
                  `${lastZone}: ${zoneTotals[lastZone]}/${zoneTotalCounts[lastZone]}`,
                  xPos - 25,
                  y.top - 14
                );
                ctx.restore();
              },
            },
            ChartDataLabels,
          ],
        });
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data]);

  return (
      <Box border={1} borderRadius={2} sx={{ 
        borderColor: color.primary[100],
         height: {
          xs: '180px',
          sm: '165px',
          md: '165px',
          lg: '190px',
          xl: '270px',
        },
        width: {
          xs: '280px',
          sm: '300px',
          md: '400px',
          lg: '540px',
          xl: '670px',
        }, }}>
        <canvas ref={canvasRef}></canvas>
      </Box>
  );
};

export default BarGraph;
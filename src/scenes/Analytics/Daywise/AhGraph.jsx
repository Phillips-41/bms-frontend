import React, { useContext, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  LabelList,
} from "recharts";
import { Dialog, DialogTitle, DialogContent, Typography, useTheme } from "@mui/material";
import { AppContext, formatDate } from "../../../services/AppContext";
import { fetchCycleData } from "../../../services/apiService";
import { bg } from "date-fns/locale";
import { tokens } from "../../../theme";

export default function AHGraph({ data }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { serialNumber, siteId, startDate } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [selectedCycleData, setSelectedCycleData] = useState([]);
  const [cycle, setCycle] = useState([]);

  const formattedData = data?.data?.content.map((item) => {
  const date = new Date(item.dayWiseDate);
  // Adjust to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const istDate = new Date(date.getTime() + istOffset);

  const month = istDate.toLocaleString("default", { month: "short" });
  const day = istDate.getDate();
  const formatToTwoDecimals = (value) =>
    value !== null && value !== undefined ? parseFloat(value).toFixed(1) : "-";
    return {
      date: `${month} ${day}`,
      cumulativeAHIn: formatToTwoDecimals(item.cumulativeAHIn),
      cumulativeAHOut: formatToTwoDecimals(item.cumulativeAHOut),
      cumulativeTotalAvgTemp: formatToTwoDecimals(item.cumulativeTotalAvgTemp),
      totalSoc: formatToTwoDecimals(item.totalSoc),
      originalDate: item.dayWiseDate,
    };
  });
  const formatTick = (value) => parseFloat(value).toFixed(1);
  // Calculate max values for scaling
  const maxAH = Math.max(
    ...formattedData.map((d) =>
      Math.max(parseFloat(d.cumulativeAHIn), parseFloat(d.cumulativeAHOut))
    ),
    0
  );
 // ...existing code...

const maxTemp = Math.max(
  ...formattedData.map((d) => parseFloat(d.cumulativeTotalAvgTemp) || 0),
  0
);

const maxSoc = Math.max(
  ...formattedData.map((d) => parseFloat(d.totalSoc) || 0),
  0
);

const leftYAxisMax = Math.max(maxAH * 1.2, 10);
const temperatureYAxisMax = Math.max(maxTemp * 1.2, 10);
const socYAxisMax = Math.max(maxSoc * 1.2, 10);

// Set either value to false when its axis should be hidden
const showTemperatureAxis = true;
const showSocAxis = true;

// ...existing code...
  const barSize = Math.max(5, Math.min(15, 500 / formattedData.length));

  const handleBarClick = async (barData) => {
    setCycle([]);
    setSelectedCycleData([]);
    const clickedDate = barData.originalDate;
    const formatToTwoDecimals = (value) =>
      value !== null && value !== undefined ? parseFloat(value).toFixed(1) : "-";
    const cycle = await fetchCycleData(data.siteId, data.serialNumber, formatDate(clickedDate));
    setCycle(cycle);
    const sameDateCycleData = cycle
      .filter((item) => {
        const itemDate = new Date(item.dayWiseDate);
        const clickedDateObj = new Date(clickedDate);
        return (
          itemDate.getFullYear() === clickedDateObj.getFullYear() &&
          itemDate.getMonth() === clickedDateObj.getMonth() &&
          itemDate.getDate() === clickedDateObj.getDate()
        );
      })
      .map((item) => ({
        cycleId: `Cycle-${item.id + 1}`,
        cumulativeAHIn: formatToTwoDecimals(item.cumulativeAHIn),
        cumulativeAHOut: formatToTwoDecimals(item.cumulativeAHOut),
        cumulativeTotalAvgTemp: formatToTwoDecimals(item.cumulativeTotalAvgTemp),
        totalSoc: formatToTwoDecimals(item.totalSoc),
      }));

    setSelectedCycleData(sameDateCycleData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Calculate max values for dialog chart
  const maxCycleAH =
    selectedCycleData.length > 0
      ? Math.max(
          ...selectedCycleData.map((d) =>
            Math.max(parseFloat(d.cumulativeAHIn), parseFloat(d.cumulativeAHOut))
          )
        )
      : 0;
  const maxCycleTempSoc =
    selectedCycleData.length > 0
      ? Math.max(
          ...selectedCycleData.map((d) =>
            Math.max(parseFloat(d.cumulativeTotalAvgTemp), parseFloat(d.totalSoc))
          )
        )
      : 0;
  const cycleLeftYAxisMax = Math.max(maxCycleAH * 1.2, 10);
  const cycleRightYAxisMax = Math.max(maxCycleTempSoc * 1.2, 10);

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
               background: colors.primary[100],
            padding: "10px 15px",
            borderRadius: "8px",
            border: colors.primary[300],
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <p style={{ margin: "0 0 5px", fontWeight: "bold", color:colors.primary[200] }}>{label}</p>
          {payload.map((entry, index) => {
            // Map dataKey to specific colors to match bar chart
            const colorMap = {
              cumulativeAHIn: "#4a90e2", // Matches blueGradient start color
              cumulativeAHOut: "#ff7f50", // Matches orangeGradient start color
              cumulativeTotalAvgTemp: "#9b59b6", // Matches Temperature line
              totalSoc: "#2ecc71", // Matches SOC line
            };
            const displayColor = colorMap[entry.dataKey] || entry.color;
            return (
              <p key={index} style={{ margin: "2px 0", color: displayColor }}>
                {entry.name}: {entry.value}
                {entry.name === "Temperature" ? "°C" : entry.name === "SOC" ? "%" : "AH"}
              </p>
            );
          })}
          {!open && 
            <p style={{ margin: "5px 0 0", color:colors.primary[200], fontSize: "12px" }}>
              Click bar to view cycle details
            </p>
          }
        </div>
      );
    }
    return null;
  };

  const chartStyle = {
    background: colors.primary[100],
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  return (
    <>
      <div style={chartStyle}>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={formattedData}
            margin={{ top: 40, right: 30, bottom: 40, left: 30 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fill: colors.primary[200], fontSize: 12 }}
              tickLine={{ stroke:colors.primary[200] }}
              axisLine={{ stroke: colors.primary[200] }}
            />
            <YAxis
              yAxisId="left"
              domain={[0, leftYAxisMax]}
              tick={{ fill:colors.primary[200], fontSize: 12 }}
              tickLine={{ stroke: colors.primary[200] }}
              axisLine={{ stroke: colors.primary[200]}}
              tickFormatter={formatTick}
              label={{
                value: "Amp Hours",
                angle: -90,
                position: "insideLeft",
                offset: 2,
                fill: colors.primary[200],
                fontSize: 14,
              }}
            />

            <YAxis
              yAxisId="temperature"
              orientation="right"
              hide={!showTemperatureAxis}
              domain={[0, temperatureYAxisMax]}
              tick={{ fill: "#9b59b6", fontSize: 12 }}
              axisLine={{ stroke: "#9b59b6" }}
              tickFormatter={formatTick}
              label={{
                value: "Temperature (°C)",
                angle: 90,
                position: "insideRight",
                fill: "#9b59b6",
              }}
            />

            <YAxis
              yAxisId="soc"
              orientation="right"
              hide={!showSocAxis}
              domain={[0, socYAxisMax]}
              tick={{ fill: "#2ecc71", fontSize: 12 }}
              axisLine={{ stroke: "#2ecc71" }}
              tickFormatter={formatTick}
              label={{
                value: "SOC (%)",
                angle: 90,
                position: "insideRight",
                offset: 35,
                fill: "#2ecc71",
              }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: 14,
                color: colors.primary[200],
              }}
            />
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a90e2" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2b6cb0" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7f50" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#e64a19" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <Bar
              yAxisId="left"
              dataKey="cumulativeAHIn"
              name="AH In"
              fill="url(#blueGradient)"
              barSize={30}
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              style={{ cursor: "pointer" }}
            >
              <LabelList
                dataKey="cumulativeAHIn"
                position="top"
                offset={10}
                fill={colors.primary[200]}
                fontSize={12}
                fontWeight="bold"
              />
            </Bar>
            <Bar
              yAxisId="left"
              dataKey="cumulativeAHOut"
              name="AH Out"
              fill="url(#orangeGradient)"
              barSize={30}
              radius={[4, 4, 0, 0]}
              onClick={handleBarClick}
              style={{ cursor: "pointer" }}
            >
              <LabelList
                dataKey="cumulativeAHOut"
                position="top"
                offset={10}
                fill={colors.primary[200]}
                fontSize={12}
                fontWeight="bold"
              />
            </Bar>
            <Line
              yAxisId="temperature"
              dataKey="cumulativeTotalAvgTemp"
              name="Temperature"
              stroke="#9b59b6"
              strokeWidth={3}
              dot={false}
            />

            <Line
              yAxisId="soc"
              dataKey="totalSoc"
              name="SOC"
              stroke="#2ecc71"
              strokeWidth={3}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
             background: colors.primary[100],
          },
        }}
      >
        <DialogTitle
          style={{
            background: colors.primary[100],
            borderBottom: colors.primary[300],
            padding: "15px 24px",
          }}
        >
          <Typography variant="h6" style={{ color: colors.primary[200] }}>
            Cycle Data for{" "}
            {selectedCycleData.length > 0 &&
              new Date(
                cycle.find(
                  (item) =>
                    item.id ===
                    parseInt(selectedCycleData[0].cycleId.split("-")[1]) - 1
                ).dayWiseDate
              ).toDateString()}
          </Typography>
        </DialogTitle>
        <DialogContent style={{ padding: "20px" }}>
          {selectedCycleData.length === 0 ? (
            <Typography
              variant="h6"
              align="center"
              style={{
                padding: "40px 20px",
                color: colors.primary[200],
                background: colors.primary[100],
                borderRadius: "8px",
                margin: "20px 0",
              }}
            >
              No cycles available for this date
            </Typography>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={selectedCycleData}
                margin={{ top: 40, right: 30, bottom: 40, left: 30 }}
              >
                <XAxis
                  dataKey="cycleId"
                  tick={{ fill: colors.primary[200], fontSize: 12 }}
                  tickLine={{ stroke: colors.primary[200] }}
                  axisLine={{ stroke:colors.primary[200] }}
                />
                <YAxis
                  yAxisId="left"
                  domain={[0, cycleLeftYAxisMax]}
                  tick={{ fill: colors.primary[200], fontSize: 12 }}
                  tickLine={{ stroke: colors.primary[200] }}
                  axisLine={{ stroke: colors.primary[200] }}
                  tickFormatter={formatTick}
                  label={{
                    value: "Amp Hours",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fill: colors.primary[200],
                    fontSize: 14,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, cycleRightYAxisMax]}
                  tick={{ fill:colors.primary[200], fontSize: 12 }}
                  tickLine={{ stroke:colors.primary[200] }}
                  axisLine={{ stroke:colors.primary[200] }}
                  tickFormatter={formatTick}
                  label={{
                    value: "Temp (°C) / SOC (%)",
                    angle: 90,
                    position: "insideRight",
                    offset: 10,
                    fill: colors.primary[200],
                    fontSize: 14,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: 14,
                    color: colors.primary[200],
                  }}
                />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a90e2" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#2b6cb0" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff7f50" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#e64a19" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <Bar
                  yAxisId="left"
                  dataKey="cumulativeAHIn"
                  name="AH In"
                  fill="url(#blueGradient)"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey="cumulativeAHIn"
                    position="top"
                    offset={10}
                    fill={colors.primary[200]}
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>
                <Bar
                  yAxisId="left"
                  dataKey="cumulativeAHOut"
                  name="AH Out"
                  fill="url(#orangeGradient)"
                  barSize={30}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList
                    dataKey="cumulativeAHOut"
                    position="top"
                    offset={10}
                    fill={colors.primary[200]}
                    fontSize={12}
                    fontWeight="bold"
                  />
                </Bar>
                <Line
                  yAxisId="right"
                  dataKey="cumulativeTotalAvgTemp"
                  name="Temperature"
                  stroke="#9b59b6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  dataKey="totalSoc"
                  name="SOC"
                  stroke="#2ecc71"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
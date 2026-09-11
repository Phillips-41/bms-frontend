import React from 'react'
import { useTable } from 'react-table';
import { Box, Typography ,Table,TableHead,TableRow,TableCell,TableBody} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';

const VoltageTemperatureTable = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Define columns for React Table
  const rowHeight = 50; // Height of each row in pixels
  const headerHeight = 40; // Height of the table header
  const containerPadding = 36; // Padding inside the container

  // Calculate the total height based on the number of rows
  const   totalHeight = data.length * rowHeight + headerHeight + containerPadding;

  return (
    <Box
  sx={{
    height: { lg: '47vh', xl: '39vh' },// Dynamic height from your original code
    overflowY: "auto",
    border: "1px solid #75767B", // Add subtle border
    borderRadius: "4px", // Rounded corners
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Subtle shadow
    backgroundColor:  colors.primary[100], // White background

  }}
>
  <Table
    sx={{
      minWidth: 300, // Ensure table doesn't get too narrow
      "& .MuiTableCell-root": { // Global cell styling
        padding: "12px", // More comfortable padding
        borderBottom: "1px solid #75767B", // Lighter border
      }
    }}
  >
    <TableHead>
      <TableRow
        sx={{
          height: `${headerHeight}px`,
          backgroundColor:  colors.primary[100], // Light gray header background
          "& .MuiTableCell-head": { // Specific header cell styling
            fontWeight: 600, // Bold headers
            color:  colors.primary[200], // Darker text
            borderBottom: "2px solid #75767B", // Stronger bottom border
          }
        }}
      >
        <TableCell>Cell No.</TableCell>
        <TableCell>Voltage (V)</TableCell>
        <TableCell>Temperature (°C)</TableCell>
        <TableCell>Specific Gravity</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((row) => (
        <TableRow
          key={row.cellNumber}
          sx={{
            height: `${rowHeight}px`,
            "& .MuiTableCell-body": { // Body cell styling
              color:  colors.primary[200], // Softer text color
            }
          }}
        >
          <TableCell>{row.cellNumber}</TableCell>
          <TableCell>
            {row.cellVoltage === 65.535 ? "N/C" : row.cellVoltage}
          </TableCell>
          <TableCell>
            {row.cellTemperature === "-255" ? "N/C" : row.cellTemperature}
          </TableCell>
          <TableCell>
            {row.cellTemperature === "-255" ? "N/C" : row.cellSpecificgravity}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</Box>
  );
};

export default VoltageTemperatureTable;



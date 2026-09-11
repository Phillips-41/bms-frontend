import React,{useContext} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  useTheme
} from '@mui/material';
import { AppContext } from '../../../services/AppContext';
import { tokens } from '../../../theme';
import { formatDateStamp } from './CellType';


export const CellAlarms=({data})=> {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const {page, setPage, rowsPerPage, setRowsPerPage, totalRecords} = useContext(AppContext);

    const maxCells = Math.max(...data.map(item=>item.cellCondition?.length || 0));
    const cellColumns = Array.from({ length: maxCells }, (_, i)=> `Cell ${i + 1}`);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };

  return (
   <>
   <TableContainer
    component={Paper}
    sx={{
        marginTop:1,
        overflowX: "auto",
        border: "1px solid black",
        borderRadius: "8px",
        backgroundColor: colors.primary[100],
            '& .MuiPaper-root': {
            backgroundColor: colors.primary[100],
        },
        maxHeight: {lg:"330px",md:"300px",sm:"270px",xs:"400px",xl:"440px"},
    }}>
        <TableHead>
            <TableRow>
                <TableCell
                sx={{
                    fontWeight: "bold",
                  background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
                  color: "black",
                  padding: "3px",
                  minWidth: "80px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  borderRight: "1px solid #ffffff50",
                }}>
                    Packet Date
                </TableCell>
                <TableCell
                sx={{
                    fontWeight: "bold",
                  background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
                  color: "black",
                  padding: "3px",
                  minWidth: "80px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  borderRight: "1px solid #ffffff50",
                }}>
                    Packet Time
                </TableCell>
                {cellColumns.map((cell, index) => (
                <TableCell
                    key={index}
                    sx={{
                    fontWeight: "bold",
                    background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
                    color: "black",
                    padding: "3px",
                    minWidth: "100px",
                    whiteSpace: "nowrap",
                    textAlign: "center",               
                    borderRight: index === cellColumns.length - 1 ? "none" : "1px solid #ffffff50",
                    }}>
                    {cell}
                </TableCell>
                ))}
            </TableRow>
        </TableHead>
        <TableBody>
        {data.map((row, index) => {
            if(!row || !row.packetDateTime){
                return null;
            }
            const packetDateTime = new Date(row.packetDateTime);
            const dateStr = packetDateTime.toLocaleDateString();
            const timeStr = packetDateTime.toLocaleTimeString();

            return(
                <TableRow 
                 key={index}
                 sx={{ height: "1px"}}>
                    <TableCell
                     sx={{
                      border: colors.primary[300],
                      padding: "2px 4px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                        color: colors.primary[200],
                      backgroundColor: 'transparent',
                    }}>
                        {formatDateStamp(dateStr)}
                    </TableCell>
                     <TableCell
                     sx={{
                      border: colors.primary[300],
                      padding: "2px 4px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                        color: colors.primary[200],
                      backgroundColor: 'transparent',
                    }}>
                        {timeStr}
                    </TableCell>

                    {Array.from({ length: maxCells}).map((_, cellIndex) => {
                        const cellData = row.cellCondition?.[cellIndex];
                        if(!cellData){
                            return(
                            <TableCell
                             key={cellIndex}
                             sx={{
                             border: colors.primary[300],
                             padding: "2px 4px",
                             fontWeight: "bold",
                             whiteSpace: "nowrap",
                             textAlign: "center",
                             color: colors.primary[200],
                             backgroundColor: 'transparent', 
                          }}
                        >
                            -
                        </TableCell>
                        );
                        }
                        return (
                            <TableCell
                            key={cellIndex}
                            sx={{
                            border: colors.primary[300], 
                            padding: "2px", 
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                            color: colors.primary[200],
                            backgroundColor: 'transparent',
                        }}
                      >
                        {cellData.cellState}
                      </TableCell>
                        );
                    })}
                </TableRow>
            );
        })}
        </TableBody>
   </TableContainer>
    <TablePagination
          rowsPerPageOptions={[25, 50, 75]}
          component="div"
          count={totalRecords || dataArray.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
       color: colors.primary[200], // White text for all elements
       backgroundColor: 'transparent !important', // Transparent background
       '& .MuiTablePagination-toolbar': {
         height: '35px', // Match TextField/DatePicker height
         color: colors.primary[200], // White toolbar text
         backgroundColor: 'transparent !important', // Transparent toolbar
       },
       '& .MuiTablePagination-selectLabel': {
         color: colors.primary[200], // White "Rows per page" label
         fontSize: '12px',
         fontFamily: 'Source Sans Pro',
         fontWeight: 'bold',
       },
       '& .MuiTablePagination-displayedRows': {
         color: colors.primary[200], // White "1-10 of 100" text
         fontSize: '12px',
         fontFamily: 'Source Sans Pro',
         fontWeight: 'bold',
       },
       '& .MuiTablePagination-select': {
         color: colors.primary[200], // White select text
         fontSize: '12px',
         fontFamily: 'Source Sans Pro',
         fontWeight: 'bold',
         '& .MuiSelect-select': {
           padding: '2px 24px 2px 8px', // Adjust padding for consistency
         },
       },
       '& .MuiTablePagination-selectIcon': {
         color: colors.primary[200], // White dropdown arrow
       },
       '& .MuiTablePagination-actions': {
         '& .MuiIconButton-root': {
           color: colors.primary[200], // White navigation icons
         },
         '& .Mui-disabled': {
           color: colors.primary[200], // White for disabled icons
           opacity: 0.5, // Slight fade for disabled state
         },
       },
       '& .MuiTablePagination-menu': {
         '& .MuiPaper-root': {
           backgroundColor: 'black !important', // Black dropdown menu
           color: colors.primary[200], // White menu items
           border: colors.primary[300], // White border for dropdown
         },
         '& .MuiMenuItem-root': {
           color: colors.primary[200], // White menu item text
           fontSize: '12px',
           fontFamily: 'Source Sans Pro',
           '&:hover': {
             backgroundColor: '#333 !important', // Darker gray on hover
           },
         },
       },
       '& .MuiInputBase-root': {
         color: colors.primary[200], // White select input
         '& .MuiOutlinedInput-notchedOutline': {
           borderColor: colors.primary[200], // White border for select
         },
         '&:hover .MuiOutlinedInput-notchedOutline': {
           borderColor: colors.primary[200], // White border on hover
         },
         '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
           borderColor: colors.primary[200], // White border when focused
         },
       },
     }}
    />
   </>
  )
}

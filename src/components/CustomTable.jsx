import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

export default function CustomTable(props) {
  const classes = useStyles();

  const { columns, rows } = props;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='custom table'>
        <TableHead>
          <TableRow>
            {(columns || []).map((column, index) => (
              <TableCell align='center' key={`${column}_${index}`}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(rows || []).map((row, index) => (
            <TableRow key={`${row.name}_${index}`}>
              {Object.keys(row).map((name, index) => (
                <TableCell align='center' key={`${name}_${index}`}>
                  {row[name]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

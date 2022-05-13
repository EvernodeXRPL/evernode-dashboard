import React, { Fragment } from 'react';

import {
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@material-ui/core';

export default function RegularTable(props) {
  const {
    headings,
    values,
    highlight,
    hideHeadings,
    className,
    cellClassName,
    headerCellClassName
  } = props;

  const keys = Object.keys(headings);
  return (
    <Fragment>
      <TableContainer className={`${className}`} component={Paper}>
        <Table aria-label="simple table">
          {!hideHeadings && <TableHead>
            <TableRow>
              {keys.map((k, i) => {
                return <TableCell
                  key={i}
                  className={((highlight && highlight.includes(k) && 'bg-secondary text-dark font-weight-bold') || '') + ` ${headerCellClassName}`}>
                  {headings[k]}
                </TableCell>
              })}
            </TableRow>
          </TableHead>}
          <TableBody>
            {values.map(value => (
              <TableRow key={value[keys[0]]}>
                {keys.map((k, i) => {
                  return <TableCell
                    key={i}
                    className={((highlight && highlight.includes(k) && 'bg-secondary text-dark font-weight-bold') || '') + ` ${cellClassName}`}
                    align="left">
                    {value[k]}
                  </TableCell>
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}

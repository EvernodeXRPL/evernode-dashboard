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
                  if (value['cellConfigs']  && i === (value['cellConfigs'].colspan)-1)
                    return null;
                  let width;
                  if (k === keys[0] && value['cellConfigs'] && value['cellConfigs'].width)
                    width = value['cellConfigs'].width;
                  let paddingTopBottom;
                  if (value['cellConfigs'] && value['cellConfigs'].paddingTopBottom)
                    paddingTopBottom = value['cellConfigs'].paddingTopBottom;
                  return <TableCell
                    key={i}
                    className={(value['cellConfigs'] && value['cellConfigs'].isSubtopic) ? 'pt-3 pb-2' : (((highlight && highlight.includes(k) && 'bg-secondary text-dark font-weight-bold') || '') + ` ${cellClassName}`)}
                    align="left"
                    style={{ width: width, paddingTop: paddingTopBottom, paddingBottom: paddingTopBottom}}
                    colSpan={((value['cellConfigs'] && value['cellConfigs'].colspan))}>
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

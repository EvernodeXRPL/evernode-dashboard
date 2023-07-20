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
    headerCellClassName,
    hideBorderAttributes
  } = props;

  const keys = Object.keys(headings);
  return (
    <Fragment>
      <TableContainer className={`${className}`} component={Paper} style={hideBorderAttributes && { boxShadow: 'none', borderRadius: '0' }}>
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
            {/* Checking whether there is a non empty object - Object.keys(value).length !== 0*/}
            {values.map(value => (Object.keys(value).length !== 0 &&
              <TableRow key={value[keys[0]]}>
                {keys.map((k, i) => {
                  if (value['cellConfigs'] && i === (value['cellConfigs'].colspan) - 1)
                    return null;
                  let width;
                  if (k === keys[0] && value['cellConfigs'] && value['cellConfigs'].width)
                    width = value['cellConfigs'].width;
                  let paddingTopBottom;
                  if (value['cellConfigs'] && value['cellConfigs'].paddingTopBottom)
                    paddingTopBottom = value['cellConfigs'].paddingTopBottom;
                  let borderBottom;
                  if (value['cellConfigs'] && value['cellConfigs'].borderBottom)
                    borderBottom = value['cellConfigs'].borderBottom;
                  let paddingLeftRight;
                  if (k === keys[1] && (value['cellConfigs'] && value['cellConfigs'].paddingLeftRight))
                    paddingLeftRight = value['cellConfigs'].paddingLeftRight;
                  return <TableCell
                    key={i}
                    className={(value['cellConfigs'] && value['cellConfigs'].isSubtopic) ? 'pt-3 pb-2' : (((highlight && highlight.includes(k) && 'bg-secondary text-dark font-weight-bold') || '') + ` ${cellClassName}`)}
                    align="left"
                    style={{ width: width, paddingTop: paddingTopBottom, paddingBottom: paddingTopBottom, paddingLeft: paddingLeftRight, paddingRight: paddingLeftRight, borderBottom: borderBottom }}
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

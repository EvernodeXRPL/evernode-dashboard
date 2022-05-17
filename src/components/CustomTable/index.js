import React, { Fragment } from 'react';

import {
  Card,
  CardContent
} from '@material-ui/core';

export default function CustomTable(props) {
  const {
    columns,
    values,
    hideHeadings,
    onRowClick
  } = props;

  const keys = Object.keys(columns);
  return (
    <Fragment>
      <Card className="card-box mb-4">
        <CardContent className="p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover text-nowrap mb-0">
              {!hideHeadings && <thead className="thead-light">
                <tr>
                  {keys.map((k, i) => {
                    return <th key={i}  className={columns[k].className}>{columns[k].title}</th>
                  })}
                </tr>
              </thead>}
              <tbody>
                {values.map((value, i) => (
                  <tr key={i} onClick={() => onRowClick(value)} style={{ cursor: 'pointer' }}>
                    {keys.map((k, j) => {
                      return <td key={j} className={columns[k].className}>
                        {value[k]}
                      </td>
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Fragment>
  );
}

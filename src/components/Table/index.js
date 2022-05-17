import React, { Fragment } from 'react';

import {
  Card,
  CardContent
} from '@material-ui/core';

export default function Table(props) {
  const {
    headings,
    values,
    hideHeadings,
    onRowClick
  } = props;

  const keys = Object.keys(headings);
  return (
    <Fragment>
      <Card className="card-box mb-4">
        <CardContent className="p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover text-nowrap mb-0">
              {!hideHeadings && <thead className="thead-light">
                <tr>
                  {keys.map((k, i) => {
                    return <th key={i}>{headings[k]}</th>
                  })}
                </tr>
              </thead>}
              <tbody>
                {values.map((value, i) => (
                  <tr key={i} onClick={() => onRowClick(value)} style={{ cursor: 'pointer' }}>
                    {keys.map((k, j) => {
                      return <td key={j}>
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

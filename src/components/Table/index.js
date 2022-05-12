import React, { Fragment } from 'react';

import {
  Avatar,
  IconButton,
  Box,
  Card,
  CardContent
} from '@material-ui/core';

import avatar1 from '../../assets/images/avatars/avatar1.jpg';

export default function Table(props) {
  const {
    values,
    onRowClick,
  } = props;

  return (
    <Fragment>
      <Card className="card-box mb-4">
        <CardContent className="p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover text-nowrap mb-0">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: '40%' }}>Employee</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {values.map((value, i) => {
                  return <tr key={i} onClick={() => { onRowClick(value) }}>
                    <td>
                      <div className="d-flex align-items-center">
                        <Avatar alt="..." src={avatar1} className="mr-2" />
                        <div>
                          <a
                            href="#/"
                            onClick={e => e.preventDefault()}
                            className="font-weight-bold text-black"
                            title="...">
                            Shanelle Wynn
                          </a>
                          <span className="text-black-50 d-block">
                            UI Engineer, Apple Inc.
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="h-auto py-0 px-3 badge badge-warning">
                        Pending
                      </div>
                    </td>
                    <td className="text-center">
                      <Box>
                        <IconButton color="primary" size="small">
                        </IconButton>
                      </Box>
                    </td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Fragment>
  );
}

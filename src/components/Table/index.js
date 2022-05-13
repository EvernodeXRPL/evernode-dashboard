import React, { Fragment } from 'react';

import {
  Card,
  CardContent
} from '@material-ui/core';

export default function Table(props) {

  const { hosts, onRowClick } = props;
  return (
    <Fragment>
      <Card className="card-box mb-4">
        <CardContent className="p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover text-nowrap mb-0">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: '30%' }}>Address</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Country Code</th>
                  <th className="text-center">CPU</th>
                  <th className="text-center">Ram</th>
                  <th className="text-center">Disk</th>
                  <th className="text-center">Total Instances</th>
                  <th className="text-center">Active Instances</th>
                </tr>
              </thead>
              <tbody>
                {hosts.map((host, index) => (
                  <tr key={index} onClick={() => onRowClick(host)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div>
                          <a
                            href="#/"
                            className="font-weight-bold text-black"
                            title="...">
                            {host.address}
                          </a>
                          <span className="text-black-50 d-block py-1">
                            {
                              host.version &&
                              <span>Version: {host.version} | </span>
                            }
                            {
                              host.description &&
                              <span>Description: {host.description}</span>
                            }
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      { (host.active && 
                        <div className="h-auto py-2 px-3 badge badge-success">
                        Active
                      </div>
                      ) || (<div className="h-auto py-2 px-3 badge badge-warning">
                      Inactive
                    </div>)}
                      
                    </td>
                    <td className="text-center">
                      {host.countryCode}
                    </td>
                    <td className="text-center">
                      {host.cpuMicrosec}
                    </td>
                    <td className="text-center">
                      {host.ramMb}
                    </td>
                    <td className="text-center">
                      {host.diskMb}
                    </td>
                    <td className="text-center">
                      {host.noOfTotalInstances}
                    </td>
                    <td className="text-center">
                      {host.noOfActiveInstances}
                    </td>
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

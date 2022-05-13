import React, { Fragment } from 'react';

import {
  Card,
  CardContent
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

export default function Table(props) {

  const history = useHistory();

  const handleRowClick = (e, address) => {
    console.log(address);
    history.push(`/hosts/${address}`);
    e.preventDefault();
  }
  console.log(props.hosts);
  return (
    <Fragment>
      <Card className="card-box mb-4">
        <CardContent className="p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover text-nowrap mb-0">
              <thead className="thead-light">
                <tr>
                  <th style={{ width: '30%' }}>Address</th>
                  <th className="text-center">Country Code</th>
                  <th className="text-center">CPU</th>
                  <th className="text-center">Ram</th>
                  <th className="text-center">Disk</th>
                  <th className="text-center">Total Instances</th>
                  <th className="text-center">Active Instances</th>
                </tr>
              </thead>
              <tbody>
                {props.hosts.map((host, index) => (
                  <tr key={index} onClick={e => handleRowClick(e, host.fields.address.stringValue)} style={{cursor: 'pointer'}}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div>
                          <a
                            href="#/"
                            className="font-weight-bold text-black"
                            title="...">
                            {host.fields.address.stringValue}
                          </a>
                          <span className="text-black-50 d-block py-1">
                            {
                              host.fields.version &&
                              <span>Version: {host.fields.version?.stringValue} | </span>
                            }
                            {
                              host.fields.description &&
                              <span>Description: {host.fields.description?.stringValue}</span>
                            }
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      {/* <div className="h-auto py-0 px-3 badge badge-warning">
                        Pending
                      </div> */}
                      {host.fields.country_code.stringValue}
                    </td>
                    <td className="text-center">
                      {/* <div className="h-auto py-0 px-3 badge badge-warning">
                        Pending
                      </div> */}
                      {host.fields.cpu_microsec.integerValue}
                    </td>
                    <td className="text-center">
                      {/* <div className="h-auto py-0 px-3 badge badge-warning">
                        Pending
                      </div> */}
                      {host.fields.ram_mb.integerValue}
                    </td>
                    <td className="text-center">
                      {/* <div className="h-auto py-0 px-3 badge badge-warning">
                        Pending
                      </div> */}
                      {host.fields.disk_mb.integerValue}
                    </td>
                    <td className="text-center">
                      {/* <Box>
                        <IconButton color="primary" size="small">
                          <FontAwesomeIcon icon={['fas', 'ellipsis-h']} />
                        </IconButton>
                      </Box> */}
                      {host.fields.no_of_total_instances.integerValue}
                    </td>
                    <td className="text-center">
                      {/* <Box>
                        <IconButton color="primary" size="small">
                          <FontAwesomeIcon icon={['fas', 'ellipsis-h']} />
                        </IconButton>
                      </Box> */}
                      {host.fields.no_of_active_instances.integerValue}
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

import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import PageTitle from '../../layout-components/PageTitle';
import Table from '../../components/Table';
import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';

export default function Hosts() {
  const history = useHistory();
  const evernode = useEvernode();

  const [hosts, setHosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function getData() {
      const data = await evernode.getHosts();
      setIsLoaded(true);
      const tableHeadings = {
        address: "Address",
        status: "Status",
        countryCode: "Country Code",
        cpu: "CPU",
        ram: "RAM",
        disk: "Disk",
        maxInstances: "Max Instances",
        activeInstances: "Active Instances"
      };
      const tableValues = data.map(host => {
        return {
          key: host.address,
          address: <div className="d-flex align-items-center">
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
          </div>,
          status: host.active ?
            <div className="h-auto py-2 px-3 badge badge-success">
              Active
            </div> :
            <div className="h-auto py-2 px-3 badge badge-warning">
              Inactive
            </div>,
          countryCode: host.countryCode,
          cpu: host.cpuMicrosec,
          ram: host.ramMb,
          disk: host.diskMb,
          maxInstances: host.maxInstances,
          activeInstances: host.activeInstances
        }
      });

      setHosts({
        hosts: data,
        tableHeadings: tableHeadings,
        tableValues: tableValues
      });
    };
    getData();
  }, [evernode]);

  const handleRowClick = useCallback((e) => {
    history.push(`/host/${e.key}`);
  }, [history]);

  return (
    <Fragment>
      <PageTitle
        titleHeading="Hosts"
      />
      {(isLoaded && <Table headings={hosts.tableHeadings} values={hosts.tableValues} onRowClick={handleRowClick} />) ||
        <Loader className="p-4" />}
    </Fragment>
  );
}

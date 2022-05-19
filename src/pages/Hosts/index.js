import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import PageTitle from '../../layout-components/PageTitle';
import CustomTable from '../../components/CustomTable';
import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';
import { Button } from '@material-ui/core';

const PAGE_SIZE = 4;

export default function Hosts() {
  const history = useHistory();
  const evernode = useEvernode();

  const [hosts, setHosts] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [pageQueue, setPageQueue] = useState([]);

  const loadHosts = useCallback(async (pageToken = null) => {
    const data = await evernode.getHosts(null, PAGE_SIZE, pageToken);
    let hostList;
    if (data.nextPageToken) {
      hostList = data.data;
      setNextPageToken(data.nextPageToken);
    }
    else {
      hostList = data;
      setNextPageToken(null);
    }

    const tableColumns = {
      address: { title: "Address", className: 'text-start' },
      status: { title: "Status", className: 'text-center' },
      countryCode: { title: "Country Code", className: 'text-center' },
      cpu: { title: "CPU", className: 'text-right' },
      ram: { title: "RAM", className: 'text-right' },
      disk: { title: "Disk", className: 'text-right' },
      maxInstances: { title: "Max Instances", className: 'text-right' },
      activeInstances: { title: "Active Instances", className: 'text-right' }
    };
    const tableValues = hostList.map(host => {
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
      tableColumns: tableColumns,
      tableValues: tableValues
    });
  }, [evernode]);

  useEffect(() => {
    loadHosts();
  }, [loadHosts]);

  const handleRowClick = useCallback((e) => {
    history.push(`/host/${e.key}`);
  }, [history]);

  const handleNextClick = useCallback(() => {
    setPageQueue([...pageQueue, nextPageToken]);
    loadHosts(nextPageToken);
  }, [loadHosts, pageQueue, nextPageToken]);

  const handlePrevClick = useCallback(() => {
    const prevPageToken = pageQueue.length > 1 ? pageQueue[pageQueue.length - 2] : null;
    setPageQueue(pageQueue.slice(0, pageQueue.length - 1));
    loadHosts(prevPageToken);
  }, [loadHosts, pageQueue]);

  return (
    <Fragment>
      <PageTitle
        titleHeading="Hosts"
      />
      {(hosts && <div>
        <CustomTable columns={hosts.tableColumns} values={hosts.tableValues} onRowClick={handleRowClick} />
        <div>
          {pageQueue.length > 0 && <Button className="pull-left" variant="contained" onClick={handlePrevClick}>Prev</Button>}
          {nextPageToken && <Button className="pull-right" variant="contained" onClick={handleNextClick}>Next</Button>}
        </div>
      </div>) ||
        <Loader className="p-4" />}
    </Fragment>
  );
}

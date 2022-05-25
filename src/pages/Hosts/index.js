import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Button } from '@material-ui/core';

import PageTitle from '../../layout-components/PageTitle';
import CustomTable from '../../components/CustomTable';
import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';
import CountryFlag from '../../business-components/CountryFlag';
import CPUModel from '../../business-components/CPUModel';
import InstanceSpecs from '../../business-components/InstanceSpecs';

const PAGE_SIZE = 10;

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
      cpuModel: { title: "CPU Model", className: 'text-center col-fixed-mw' },
      instanceSize: { title: "Instance Size", className: 'text-center col-fixed-mw' },
      maxInstances: { title: "Max Instances", className: 'text-center' },
      activeInstances: { title: "Active Instances", className: 'text-center' }
    };
    const tableValues = data.map(host => {
      return {
        key: host.address,
        address: <div className="d-flex align-items-center">
          <CountryFlag countryCode={host.countryCode} size="3em" />
          <div className="ml-3">
            <a
              href="#/"
              className="font-weight-bold text-black"
              title="...">
              {host.address}
            </a>
            <span className="text-black-50 d-block py-1">
              {
                host.version &&
                <span>v{host.version} | </span>
              }
              {
                host.description &&
                <span>{host.description}</span>
              }
            </span>
          </div>
        </div>,
        status: host.active ?
          <div className="h-auto py-2 badge badge-success" style={{ width: '4.25rem', fontSize: '0.75rem' }}>
            Active
          </div> :
          <div className="h-auto py-2 badge badge-warning" style={{ width: '4.25rem', fontSize: '0.75rem' }}>
            Inactive
          </div>,
        cpuModel: <CPUModel modelName={host.cpuModelName} speed={host.cpuMHz} count={host.cpuCount} />,
        instanceSize: <InstanceSpecs cpu={host.cpuMicrosec} ram={host.ramMb} disk={host.diskMb} instanceCount={host.maxInstances} />,
        maxInstances: host.maxInstances || 0,
        activeInstances: host.activeInstances || 0
      }
    });

    setHosts({
      hosts: hostList,
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

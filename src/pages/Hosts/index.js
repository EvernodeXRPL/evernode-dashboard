import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import PageTitle from '../../layout-components/PageTitle';
import CustomTable from '../../components/CustomTable';
import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';
import ReactCountryFlag from "react-country-flag"
import { Tooltip, withStyles } from '@material-ui/core';


export default function Hosts() {
  const history = useHistory();
  const evernode = useEvernode();

  const [hosts, setHosts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Overriding tooltip styles to keep tooltip near the flag.
  const StyledTooltip = withStyles({
    tooltipPlacementRight: {
      marginLeft: "-0.5rem",
    },
  })(Tooltip);

  useEffect(() => {
    async function getData() {
      const data = await evernode.getHosts();
      setIsLoaded(true);
      const tableColumns = {
        address: { title: "Address", className: 'text-start' },
        status: { title: "Status", className: 'text-center' },
        cpuModel: { title: "CPU Model", className: 'text-center' },
        instanceSize: { title: "Instance Size", className: 'text-center' },
        maxInstances: { title: "Max Instances", className: 'text-center' },
        activeInstances: { title: "Active Instances", className: 'text-center' }
      };
      const tableValues = data.map(host => {
        return {
          key: host.address,
          address: <div className="d-flex align-items-center">
            <StyledTooltip title={host.countryCode} placement='right-end'>
              <div>
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode={host.countryCode}
                  style={{
                    fontSize: '2em',
                    lineHeight: '1.5em',
                    paddingRight: '0.5em'
                  }}
                  aria-label={host.countryCode}
                  alt={host.countryCode}
                />
              </div>
            </StyledTooltip>
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
            <div className="h-auto py-2 badge badge-success" style={{width: '4.25rem', fontSize: '0.75rem'}}>
              Active
            </div> :
            <div className="h-auto py-2 badge badge-warning" style={{width: '4.25rem', fontSize: '0.75rem'}}>
              Inactive
            </div>,
          cpuModel: `${host.cpuModelName}, ${host.cpuMHz} MHz, ${host.cpuCount} cores`,
          instanceSize: `${(host.cpuMicrosec/10000)}% CPU, ${(host.ramMb/1000).toFixed(2)} GB RAM, ${(host.diskMb/1000).toFixed(2)} GB Disk`,
          maxInstances: host.maxInstances,
          activeInstances: host.activeInstances
        }
      });

      setHosts({
        hosts: data,
        tableColumns: tableColumns,
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
      {(isLoaded && <CustomTable columns={hosts.tableColumns} values={hosts.tableValues} onRowClick={handleRowClick} />) ||
        <Loader className="p-4" />}
    </Fragment>
  );
}

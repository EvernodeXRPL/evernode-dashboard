import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Button } from '@material-ui/core';

import PageTitle from '../../layout-components/PageTitle';
import CustomTable from '../../components/CustomTable';
import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';

const PAGE_SIZE = 10;

const Candidates = () => {
    const history = useHistory();
    const evernode = useEvernode();

    const [hosts, setHosts] = useState(null);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [pageQueue, setPageQueue] = useState([]);
    const [isHostsLoading, setIsHostsLoading] = useState(false);

    useEffect(() => {
        const fetchConfigs = async () => {
            const xx = await evernode.getCandidates();
            console.log("xx", xx)
        }

        fetchConfigs();
    }, [evernode]);

    const loadHosts = useCallback(async (pageToken = null) => {
        const data = await evernode.getCandidates(null, PAGE_SIZE, pageToken);
        console.log("data", data)
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
            address: { title: "Candidate ID", className: 'text-start' },
            status: { title: "Status", className: 'text-center' },
            cpuModel: { title: "positive Vote Count", className: 'text-center col-fixed-mw' },
            instanceSize: { title: "Proposal Fee", className: 'text-center col-fixed-mw' },
            maxInstances: { title: "Foundation Vote Status", className: 'text-center' },
        };
        const tableValues = hostList.map(host => {
            return {
                key: host.id,
                address: <div className="d-flex align-items-center">
                    <div>
                        <p className="font-weight-bold m-0">
                            {host.id}
                        </p>
                    </div>
                </div>,
                status: host.status === "supported" ?
                    <div className="h-auto py-2 badge badge-success" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                        Supported
                    </div> : host.status === "elected" ?
                        <div className="h-auto py-2 badge badge-primary" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                            Elected
                        </div> : host.status === "vetoed" ?
                            <div className="h-auto py-2 badge badge-warning" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                                Vetoed
                            </div> : host.status === "expired" ?
                                <div className="h-auto py-2 badge badge-dark" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                                    Expired
                                </div> : <div className="h-auto py-2 badge badge-danger" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                                    Rejected
                                </div>,
                cpuModel: <div>{host.positiveVoteCount}</div>,
                instanceSize: <div>{host.proposalFee}</div>,
                maxInstances: host.foundationVoteStatus === "supported" ?
                    <div className="h-auto py-2 badge badge-success" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                        Supported
                    </div> : <div className="h-auto py-2 badge badge-danger" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                        Rejected
                    </div>
            }
        });

        setHosts({
            hosts: hostList,
            tableColumns: tableColumns,
            tableValues: tableValues
        });

        setIsHostsLoading(false);
    }, [evernode]);

    useEffect(() => {
        loadHosts();
    }, [loadHosts]);

    const handleRowClick = useCallback((e) => {
        if (isHostsLoading)
            return;
        history.push(`/candidate/${e.key}`);
    }, [history, isHostsLoading]);

    const handleNextClick = useCallback(() => {
        setIsHostsLoading(true);
        setPageQueue([...pageQueue, nextPageToken]);
        loadHosts(nextPageToken);
    }, [loadHosts, pageQueue, nextPageToken]);

    const handlePrevClick = useCallback(() => {
        setIsHostsLoading(true);
        const prevPageToken = pageQueue.length > 1 ? pageQueue[pageQueue.length - 2] : null;
        setPageQueue(pageQueue.slice(0, pageQueue.length - 1));
        loadHosts(prevPageToken);
    }, [loadHosts, pageQueue]);

    return (
        <Fragment>
            <PageTitle
                titleHeading="Candidates"
            />
            {isHostsLoading && <Loader className={`hostsLoader "p-4"`} />}
            {(hosts && <div>
                <CustomTable columns={hosts.tableColumns} values={hosts.tableValues} blurTable={isHostsLoading} onRowClick={handleRowClick} />
                <div>
                    {pageQueue.length > 0 && <Button className="pull-left" variant="contained" disabled={isHostsLoading} onClick={handlePrevClick}>Prev</Button>}
                    {nextPageToken && <Button className="pull-right" variant="contained" disabled={isHostsLoading} onClick={handleNextClick}>Next</Button>}
                </div>
            </div>)}
        </Fragment>
    )
}

export default Candidates
import React, { Fragment, useCallback, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import PageTitle from '../../layout-components/PageTitle';
import RegularTable from '../../components/RegularTable';

import {
    Grid,
    Card,
    CardContent,
    Tooltip,
} from '@material-ui/core';

import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';
import { StorageKeys } from '../../common/constants';

const Candidate = (props) => {
    const history = useHistory();
    const evernode = useEvernode();

    const selfAddress = localStorage.getItem(StorageKeys.hostAddress);
    const pathAddress = props.match.params.candidateId;

    const [address, setAddress] = React.useState(pathAddress || selfAddress);
    const [info, setInfo] = React.useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            setInfo(null);
            const hosts = await evernode.getCandidateById(address);
            const hostInfo = (hosts) ? hosts : null;
            const tableHeadings = {
                key: 'Key',
                value: 'Value'
            }
            let tableValues = hostInfo ? [
                {
                    key: 'Created Timestamp',
                    value: <Tooltip title="Created Timestamp"><span>{hostInfo.createdTimestamp
                    }</span></Tooltip>
                },
                {
                    key: 'Foundation Vote Status',
                    value: <Tooltip title="Foundation Vote Status">
                        <span>{hostInfo.foundationVoteStatus}</span>
                    </Tooltip>
                },
                {
                    key: 'Last Vote Timestamp',
                    value: <Tooltip title="Last Vote Timestamp">
                        <span>{hostInfo.lastVoteTimestamp}</span>
                    </Tooltip>
                },
                {
                    key: 'Owner Address',
                    value: <Tooltip title="Owner Address">
                        <span>{hostInfo.ownerAddress}</span>
                    </Tooltip>
                },
                {
                    key: 'Proposal Fee',
                    value: <Tooltip title="Proposal Fee">
                        <span>{hostInfo.proposalFee}</span>
                    </Tooltip>
                },
                {
                    key: 'Short Name',
                    value: <Tooltip title="Short Name">
                        <span>{hostInfo.shortName}</span>
                    </Tooltip>
                },
                {
                    key: 'Status',
                    value: <Tooltip title="Status">
                        <span>{hostInfo.status}</span>
                    </Tooltip>
                },
                {
                    key: 'Status Change Timestamp',
                    value: <Tooltip title="Status Change Timestamp">
                        <span>{hostInfo.statusChangeTimestamp}</span>
                    </Tooltip>
                },
            ] : [];
            setInfo({
                hostInfo: hostInfo,
                tableHeadings: tableHeadings,
                tableValues: tableValues
            });
        }

        // If no address is set in local storage.
        if (pathAddress === selfAddress)
            history.push('/host');
        else
            fetchInfo();
    }, [evernode, history, address, pathAddress, selfAddress]);
    return (
        <>{address &&
            <Fragment>
                <PageTitle
                    responsive={true}
                    titleHeading={
                        <div className="d-flex align-items-center display-7">
                            {address}
                        </div>
                    }
                >
                </PageTitle>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card
                            style={{ border: "none", boxShadow: "none" }}
                            className="mb-4 bg-transparent"
                        >
                            <CardContent className="p-0">
                                <h5 className="card-title font-weight-bold font-size-md">
                                    Candidate Info
                                </h5>
                                {(info &&
                                    (info.hostInfo ? (
                                        <RegularTable
                                            headings={info.tableHeadings}
                                            values={info.tableValues}
                                            highlight={["key"]}
                                            hideHeadings
                                        />
                                    ) : (
                                        <span>Candidate info is not available!</span>
                                    ))) || <Loader className="p-4" />}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Fragment >}
        </>
    )
}

export default Candidate
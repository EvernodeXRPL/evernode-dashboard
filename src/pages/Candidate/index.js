import React, { Fragment, useEffect } from 'react';
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

const Candidate = (props) => {
    const history = useHistory();
    const evernode = useEvernode();
    const candidateId = props.match.params.candidateId;
    const [info, setInfo] = React.useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            setInfo(null);
            const candidate = await evernode.getCandidateById(candidateId);
            const candidateInfo = (candidate) ? candidate : null;
            const tableHeadings = {
                key: 'Key',
                value: 'Value'
            }
            let tableValues = candidateInfo ? [
                {
                    key: 'Created Timestamp',
                    value: <Tooltip title="Created Timestamp"><span>{candidateInfo.createdTimestamp
                    }</span></Tooltip>
                },
                {
                    key: 'Foundation Vote Status',
                    value: <Tooltip title="Foundation Vote Status">
                        {candidateInfo.foundationVoteStatus === "supported" ? <div className="h-auto py-2 badge badge-success" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                            Supported
                        </div> : <div className="h-auto py-2 badge badge-danger" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                            Rejected
                        </div>}
                    </Tooltip>
                },
                {
                    key: 'Last Vote Timestamp',
                    value: <Tooltip title="Last Vote Timestamp">
                        <span>{candidateInfo.lastVoteTimestamp}</span>
                    </Tooltip>
                },
                {
                    key: 'Owner Address',
                    value: <Tooltip title="Owner Address">
                        <span>{candidateInfo.ownerAddress}</span>
                    </Tooltip>
                },
                {
                    key: 'Proposal Fee',
                    value: <Tooltip title="Proposal Fee">
                        <span>{candidateInfo.proposalFee}</span>
                    </Tooltip>
                },
                {
                    key: 'Short Name',
                    value: <Tooltip title="Short Name">
                        <span>{candidateInfo.shortName}</span>
                    </Tooltip>
                },
                {
                    key: 'Status',
                    value: <Tooltip title="Status">
                        {candidateInfo.status === "supported" ? <div className="h-auto py-2 badge badge-success" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                            Supported
                        </div> : candidate.status === "elected" ?
                            <div className="h-auto py-2 badge badge-primary" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                                Elected
                            </div> : candidate.status === "vetoed" ?
                                <div className="h-auto py-2 badge badge-warning" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                                    Vetoed
                                </div> : candidate.status === "expired" ?
                                    <div className="h-auto py-2 badge badge-dark" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                                        Expired
                                    </div> : <div className="h-auto py-2 badge badge-danger" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                                        Rejected
                                    </div>}
                    </Tooltip>
                },
                {
                    key: 'Status Change Timestamp',
                    value: <Tooltip title="Status Change Timestamp">
                        <span>{candidateInfo.statusChangeTimestamp}</span>
                    </Tooltip>
                },
            ] : [];
            setInfo({
                candidateInfo: candidateInfo,
                tableHeadings: tableHeadings,
                tableValues: tableValues
            });
        }

        fetchInfo();
    }, [evernode, history, candidateId]);
    return (
        <>{candidateId &&
            <Fragment>
                <PageTitle
                    responsive={true}
                    titleHeading={
                        <div className="d-flex align-items-center display-7">
                            {candidateId}
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
                                    (info.candidateInfo ? (
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
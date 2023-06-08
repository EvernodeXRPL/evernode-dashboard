import React, { Fragment, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import PageTitle from '../../layout-components/PageTitle';
import RegularTable from '../../components/RegularTable';
import LabelText from '../../components/Label/LabelText'
import { CandidateType } from "../../common/constants"

import {
    Grid,
    Card,
    CardContent,
    Tooltip
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
            const config = await evernode.getConfigs();
            setInfo(null);
            const candidate = await evernode.getCandidateById(candidateId);
            const candidateInfo = (candidate) ? candidate : null;
            const candidateType = await evernode.getCandidateType(candidateId);

            let candidateTypeName;
            switch (candidateType) {
                case 1:
                    candidateTypeName = CandidateType.newHookCandidate
                    break;
                case 2:
                    candidateTypeName = CandidateType.pilotedModeCandidate
                    break;
                default:
                    candidateTypeName = CandidateType.dudHostCandidate
            }

            const tableHeadings = {
                key: 'Key',
                value: 'Value'
            }
            let tableValues = candidateInfo ? [
                {
                    key: 'Candidate Type',
                    value: <Tooltip title="Candidate Type">
                        <span>{candidateTypeName}</span>
                    </Tooltip>
                },
                (candidateInfo.governorHookHash ? {
                    key: 'Governor Hook Hash',
                    value: <Tooltip title="Governor Hook Hash">
                        <span>{candidateInfo.governorHookHash}</span>
                    </Tooltip>
                } : {}),
                (candidateInfo.heartbeatHookHash ? {
                    key: 'Heartbeat Hook Hash',
                    value: <Tooltip title="Heartbeat Hook Hash">
                        <span>{candidateInfo.heartbeatHookHash}</span>
                    </Tooltip>
                } : {}),
                (candidateInfo.registryHookHash ? {
                    key: 'Registry Hook Hash',
                    value: <Tooltip title="Registry Hook Hash">
                        <span>{candidateInfo.registryHookHash}</span>
                    </Tooltip>
                } : {}),
                {
                    key: 'Positive Vote Count/ Vote Base Count',
                    value: <Tooltip title="Positive Vote Count/ Vote Base Count"><span>{`${candidateInfo.positiveVoteCount}/ ${config.governanceInfo.voteBaseCount}`}</span></Tooltip>
                },
                {
                    key: 'Created Timestamp',
                    value: <Tooltip title="Created Timestamp"><span>{candidateInfo.createdTimestamp
                    }</span></Tooltip>
                },
                {
                    key: 'Foundation Vote Status',
                    value: <Tooltip title="Foundation Vote Status">
                        <>
                            {candidateInfo.foundationVoteStatus === "supported" ? <LabelText labelType="success">
                                Supported
                            </LabelText> : <LabelText labelType="warning">
                                Rejected
                            </LabelText>}
                        </>
                    </Tooltip>
                },
                (candidateInfo.ownerAddress ? {
                    key: 'Last Vote Timestamp',
                    value: <Tooltip title="Last Vote Timestamp">
                        <span>{candidateInfo.lastVoteTimestamp}</span>
                    </Tooltip>
                } : {}),
                (candidateInfo.proposalFee ? {
                    key: 'Owner Address',
                    value: <Tooltip title="Owner Address">
                        <span>{candidateInfo.ownerAddress}</span>
                    </Tooltip>
                } : {}),
                (candidateInfo.proposalFee ? {
                    key: 'Proposal Fee (EVRs)',
                    value: <Tooltip title="Proposal Fee (EVRs)">
                        <span>{candidateInfo.proposalFee}</span>
                    </Tooltip>
                } : {}),
                {
                    key: 'Short Name',
                    value: <Tooltip title="Short Name">
                        <span>{candidateInfo.shortName}</span>
                    </Tooltip>
                },
                {
                    key: 'Status',
                    value: <Tooltip title="Status">
                        <>
                            {candidateInfo.status === "supported" ? <LabelText labelType="success">
                                Supported
                            </LabelText> : candidate.status === "elected" ?
                                <LabelText labelType="primary">
                                    Elected
                                </LabelText> : candidate.status === "purged" ?
                                        <LabelText labelType="dark">
                                            Purged
                                        </LabelText> : <LabelText labelType="warning">
                                            Rejected
                                        </LabelText>}
                        </>
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
                        <div className="d-flex align-items-center display-7 singleCandidateTitle">
                            {candidateId}
                        </div>
                    }
                    singleCandidateWrapperClass="singleCandidateWrapperClass"
                >
                </PageTitle>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={12}>
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
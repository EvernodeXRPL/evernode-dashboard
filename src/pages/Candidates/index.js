import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Badge, Button } from '@material-ui/core';

import PageTitle from '../../layout-components/PageTitle';
import CustomTable from '../../components/CustomTable';
import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';
import LabelText from '../../components/Label/LabelText'
import { CandidateType } from "../../common/constants"
import CopyBox from '../../components/CopyBox';

const PAGE_SIZE = 10;

const Candidates = () => {
    const history = useHistory();
    const evernode = useEvernode();

    const [candidates, setCandidates] = useState(null);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [pageQueue, setPageQueue] = useState([]);
    const [isCandidatesLoading, setIsCandidatesLoading] = useState(false);

    const updateCandidateType = useCallback(async (candidate) => {
        const candidateType = await evernode.getCandidateType(candidate.id);
        return { ...candidate, candidateType };
    }, [evernode]);

    const loadCandidates = useCallback(async (pageToken = null) => {
        const data = await evernode.getCandidates(null, PAGE_SIZE, pageToken);
        const config = await evernode.getConfigs();
        let candidateList;
        if (data.nextPageToken) {
            candidateList = data.data;
            setNextPageToken(data.nextPageToken);
        }
        else {
            candidateList = data;
            setNextPageToken(null);
        }

        const updatedCandidateList = await Promise.all(candidateList.map(updateCandidateType));

        const tableColumns = {
            candidateId: { title: "Candidate ID", className: 'text-start' },
            candidateStatus: { title: "Status", className: 'text-center' },
            positiveVoteCountVsVoteBaseCount: { title: "Vote Support Ratio", className: 'text-center col-fixed-mw' },
            proposalFee: { title: "Proposal Fee (EVRs)", className: 'text-center col-fixed-mw' },
            foundationVoteStatus: { title: "Foundation Vote Status", className: 'text-center' },
            candidateType: { title: "Candidate Type", className: 'text-center' },
        };
        const tableValues = updatedCandidateList.map((candidate) => {

            return {
                key: candidate.uniqueId,
                candidateId: <div className="d-flex align-items-center">
                    <CopyBox copyText={candidate.uniqueId} iconSize="16">
                        <p className="font-weight-bold m-0">
                            {candidate.uniqueId}
                        </p>
                    </CopyBox>
                </div>,
                candidateStatus: candidate.status === "supported" ?
                    <LabelText labelType="success">
                        Supported
                    </LabelText> : candidate.status === "elected" ?
                        <LabelText labelType="primary">
                            Elected
                        </LabelText> : candidate.status === "purged" ?
                            <LabelText labelType="dark">
                                Purged
                            </LabelText> : <LabelText labelType="warning">
                                Rejected
                            </LabelText>,
                positiveVoteCountVsVoteBaseCount: config.governanceInfo.voteBaseCount !== 0 ? <div>{`${candidate.positiveVoteCount} out of ${config.governanceInfo.voteBaseCount}`}</div> : <div> - </div>,
                proposalFee: <div>{candidate.proposalFee}</div>,
                foundationVoteStatus: candidate.foundationVoteStatus === "supported" ?
                    <LabelText labelType="success">
                        Supported
                    </LabelText> : <LabelText labelType="warning">
                        Rejected
                    </LabelText>,
                candidateType: <Badge badgeContent={candidate.candidateType === 1 ? CandidateType.newHookCandidate : candidate.candidateType === 2 ? CandidateType.pilotedModeCandidate : CandidateType.dudHostCandidate}></Badge>,
            }
        });

        setCandidates({
            candidates: updatedCandidateList,
            tableColumns: tableColumns,
            tableValues: tableValues
        });

        setIsCandidatesLoading(false);
    }, [evernode, updateCandidateType]);

    useEffect(() => {
        loadCandidates();
    }, [loadCandidates]);

    const handleRowClick = useCallback((e) => {
        if (isCandidatesLoading)
            return;
        history.push(`/candidate/${e.key}`);
    }, [history, isCandidatesLoading]);

    const handleNextClick = useCallback(() => {
        setIsCandidatesLoading(true);
        setPageQueue([...pageQueue, nextPageToken]);
        loadCandidates(nextPageToken);
    }, [loadCandidates, pageQueue, nextPageToken]);

    const handlePrevClick = useCallback(() => {
        setIsCandidatesLoading(true);
        const prevPageToken = pageQueue.length > 1 ? pageQueue[pageQueue.length - 2] : null;
        setPageQueue(pageQueue.slice(0, pageQueue.length - 1));
        loadCandidates(prevPageToken);
    }, [loadCandidates, pageQueue]);

    return (
        <Fragment>
            <PageTitle
                titleHeading="Candidates"
            />
            {isCandidatesLoading && <Loader className={`hostsLoader "p-4"`} />}
            {(candidates && <div>
                <CustomTable columns={candidates.tableColumns} values={candidates.tableValues} blurTable={isCandidatesLoading} onRowClick={handleRowClick} />
                <div>
                    {pageQueue.length > 0 && <Button className="pull-left" variant="contained" disabled={isCandidatesLoading} onClick={handlePrevClick}>Prev</Button>}
                    {nextPageToken && <Button className="pull-right" variant="contained" disabled={isCandidatesLoading} onClick={handleNextClick}>Next</Button>}
                </div>
            </div>)}
        </Fragment>
    )
}

export default Candidates
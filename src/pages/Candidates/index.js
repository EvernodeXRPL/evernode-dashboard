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

    const [candidates, setCandidates] = useState(null);
    const [nextPageToken, setNextPageToken] = useState(null);
    const [pageQueue, setPageQueue] = useState([]);
    const [isCandidatesLoading, setIsCandidatesLoading] = useState(false);

    const loadCandidates = useCallback(async (pageToken = null) => {
        const data = await evernode.getCandidates(null, PAGE_SIZE, pageToken);
        let candidateList;
        if (data.nextPageToken) {
            candidateList = data.data;
            setNextPageToken(data.nextPageToken);
        }
        else {
            candidateList = data;
            setNextPageToken(null);
        }

        const tableColumns = {
            candidateId: { title: "Candidate ID", className: 'text-start' },
            candidateStatus: { title: "Status", className: 'text-center' },
            positiveVoteCount: { title: "positive Vote Count", className: 'text-center col-fixed-mw' },
            proposalFee: { title: "Proposal Fee", className: 'text-center col-fixed-mw' },
            foundationVoteStatus: { title: "Foundation Vote Status", className: 'text-center' },
        };
        const tableValues = candidateList.map(candidate => {
            return {
                key: candidate.id,
                candidateId: <div className="d-flex align-items-center">
                    <div>
                        <p className="font-weight-bold m-0">
                            {candidate.id}
                        </p>
                    </div>
                </div>,
                candidateStatus: candidate.status === "supported" ?
                    <div className="h-auto py-2 badge badge-success" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
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
                                </div>,
                positiveVoteCount: <div>{candidate.positiveVoteCount}</div>,
                proposalFee: <div>{candidate.proposalFee}</div>,
                foundationVoteStatus: candidate.foundationVoteStatus === "supported" ?
                    <div className="h-auto py-2 badge badge-success" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                        Supported
                    </div> : <div className="h-auto py-2 badge badge-danger" style={{ width: '4.8rem', fontSize: '0.75rem' }}>
                        Rejected
                    </div>
            }
        });

        setCandidates({
            candidates: candidateList,
            tableColumns: tableColumns,
            tableValues: tableValues
        });

        setIsCandidatesLoading(false);
    }, [evernode]);

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
import React, { Fragment, useCallback, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import EditIcon from '@material-ui/icons/Edit';

import PageTitle from '../../layout-components/PageTitle';
import RegularTable from '../../components/RegularTable';

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Tooltip,
    TextField,
    Button,
    Hidden
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Leases from '../../business-components/Leases';

import { useEvernode } from '../../services/Evernode';
import Loader from '../../components/Loader';
import { StorageKeys } from '../../common/constants';
import CountryFlag from '../../business-components/CountryFlag';
import EvrBalance from '../../business-components/EvrBalance';
import CPUModel from '../../business-components/CPUModel';
import InstanceSpecs from '../../business-components/InstanceSpecs';
import ModalDialog from '../../components/ModalDialog';

const useStyles = makeStyles({
    root: {
        // input label when focused
        "& label.Mui-focused": {
            color: 'rgba(0,0,0,0.54)'
        },
        "& label.Mui-error": {
            color: 'red'
        },
        // focused color for input with variant='standard'
        "& .MuiInput-underline:after": {
            borderBottomColor: 'rgba(0,0,0,0.87)'
        },
        "& .MuiInput-underline.Mui-error:after": {
            borderBottomColor: '#f83245'
        },
        "& label.MuiInputLabel-shrink": {
            transform: 'translate(0, 1.5px) scale(0.95)',
            transformOrigin: 'top left'
        }
    }
});

const Candidate = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const evernode = useEvernode();

    const selfAddress = localStorage.getItem(StorageKeys.hostAddress);
    console.log("props.match.params.address", props.match.params.candidateId)
    const pathAddress = props.match.params.candidateId;

    const [address, setAddress] = React.useState(pathAddress || selfAddress);
    const [inputAddress, setInputAddress] = React.useState(null);
    const [info, setInfo] = React.useState(null);
    const [showChangeAddress, setShowChangeAddress] = React.useState(false);

    const inputAddressValid = useCallback(() => {
        return /^r[a-zA-Z0-9]{24,34}$/g.test(inputAddress);
    }, [inputAddress])

    const handleChangeAddress = useCallback(() => {
        if (inputAddress && inputAddressValid()) {
            localStorage.setItem(StorageKeys.hostAddress, inputAddress);
            setAddress(inputAddress);
            setInputAddress(null);
            setShowChangeAddress(false);
        }
    }, [inputAddress, inputAddressValid]);

    const handleChangeAddressClose = useCallback(() => {
        setShowChangeAddress(false);
        setInputAddress(null);
        // If the address change modal is closed without changing the address,
        // Redirect to the home page.
        if (!address)
            history.push('/')
    }, [address, history]);

    useEffect(() => {
        const fetchInfo = async () => {
            setInfo(null);
            console.log('candidateIdddd', address)
            const hosts = await evernode.getCandidateById(address);
            console.log('hosts', hosts)
            const config = await evernode.getConfigs();
            const hostInfo = hosts;
            console.log('hostInfo', hostInfo)
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
            if (hostInfo?.registrationTimestamp)
                tableValues.push(
                    {
                        key: 'Registered on Timestamp',
                        value: <Tooltip title="Timestamp at which the host registered"><span>{hostInfo.registrationTimestamp}</span></Tooltip>
                    });
            // const evrBalance = await evernode.getEVRBalance(address);
            setInfo({
                // evrBalance: evrBalance,
                hostInfo: hostInfo,
                tableHeadings: tableHeadings,
                tableValues: tableValues
            });
        }

        // If the path address param is empty this is My Host page and no address is set in local storage.
        if (!address)
            setShowChangeAddress(true);
        else if (pathAddress === selfAddress)
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
                    {info && info.hostInfo && info.hostInfo.hostMessage ? (
                        <Grid item xs={12}>
                            <Card
                                style={{ border: "none", boxShadow: "none" }}
                                className="mb-4 bg-transparent"
                            >
                                <CardContent className="p-0">
                                    <div className="p-3 border rounded host-message mb-0">
                                        {(info &&
                                            (info.hostInfo.hostMessage
                                                ? info.hostInfo.hostMessage
                                                : "There is no host message available!")) || (
                                                <Loader className="p-4" />
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ) : null}
                </Grid>
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
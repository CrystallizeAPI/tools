import { EVENT_NAMES } from '@crystallize/import-utilities';
import { Text, useApp } from 'ink';
import React, { useState } from 'react';
import { useReducer } from 'react';
import { colors } from '../../../config/colors.js';
import { PimAuthenticatedUser, PimCredentials } from '../../../types.js';
import { ImportStatus } from '../../components/ImportStatus.js';
import { Messages } from '../../components/Messages.js';
import { SetupCredentials } from '../../components/SetupCredentials.js';
import { Spinner } from '../../components/Spinner.js';
import createTenant from '../../use-cases/createTenant.js';
import importTentantDump from '../../use-cases/importTentantDump.js';
import { fetchAvailableTenantIdentifier } from '../../utils/crystallize.js';
import { State, Reducer } from './reducer.js';

export const ImportTenantDumpJourney: React.FC<{
    specFilePath: string;
    tenantIdentifier: string;
    isVerbose?: boolean;
}> = ({ specFilePath, tenantIdentifier, isVerbose = false }) => {
    const { exit } = useApp();

    const [status, setStatus] = useState(null);
    const [state, dispatch] = useReducer(Reducer, {
        feedbackIndex: 0,
        messages: [],
        isDone: false,
        isImporting: false,
    });

    return (
        <>
            {!state.credentials && (
                <SetupCredentials
                    dispatch={(user: PimAuthenticatedUser, credentials: PimCredentials) => {
                        dispatch({ type: 'SET_CREDENTIALS', credentials });
                        fetchAvailableTenantIdentifier(credentials, tenantIdentifier).then(
                            (availableIdentifier: string) => {
                                const newTenant = {
                                    identifier: availableIdentifier,
                                };
                                dispatch({
                                    type: 'CHANGE_TENANT',
                                    item: newTenant,
                                });
                                createTenant(newTenant, credentials, user).then(() => {
                                    dispatch({ type: 'IMPORT_STARTED' });
                                    importTentantDump(
                                        newTenant.identifier,
                                        specFilePath,
                                        credentials,
                                        (eventName: string, message: string | any) => {
                                            if (eventName === EVENT_NAMES.STATUS_UPDATE) {
                                                setStatus(message);
                                                return;
                                            }
                                            dispatch({ type: 'ADD_MESSAGE', message: `${eventName}: ${message}` });
                                        },
                                    ).then(() => {
                                        dispatch({ type: 'IMPORT_DONE' });
                                        exit();
                                    });
                                });
                            },
                        );
                    }}
                />
            )}
            {state.credentials && <CreateTenant state={state} requestedTenantIdentifier={tenantIdentifier} />}
            {state.isImporting && (
                <>
                    <Text>
                        <Spinner />
                        Importing tenant
                    </Text>
                    {status && <ImportStatus status={status} />}
                </>
            )}
            {state.isDone && <>{status && <ImportStatus status={status} />}</>}
            {state.messages.length > 0 && <Messages title="Trace" messages={state.messages} />}
        </>
    );
};

export const CreateTenant: React.FC<{
    requestedTenantIdentifier: string;
    state: State;
}> = ({ requestedTenantIdentifier, state }) => {
    return (
        <>
            <Text>
                {!state.tenant?.identifier && <Spinner />}
                Creating tenant: <Text dimColor>{state.tenant?.identifier || requestedTenantIdentifier}</Text>
            </Text>
            {state.tenant?.identifier && state.tenant.identifier !== requestedTenantIdentifier && (
                <Text dimColor>
                    We changed the asked tenant identifier from {requestedTenantIdentifier} to{' '}
                    <Text color={colors.highlight}>{state.tenant.identifier}</Text>.
                </Text>
            )}
        </>
    );
};

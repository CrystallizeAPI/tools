import { Text, useApp } from 'ink';
import React, { Dispatch } from 'react';
import { useEffect, useReducer } from 'react';
import { colors } from '../../../config/colors.js';
import { PimAuthenticatedUser, PimCredentials } from '../../../types.js';
import { Messages } from '../../components/Messages.js';
import { SetupCredentials } from '../../components/SetupCredentials.js';
import { Spinner } from '../../components/Spinner.js';
import createTenant from '../../use-cases/createTenant.js';
import importTentantDump from '../../use-cases/importTentantDump.js';
import { fetchAvailableTenantIdentifier } from '../../utils/crystallize.js';
import { Action, State, Reducer } from './reducer.js';

const feedbacks = [
    'Importing...',
    'Media...',
    'Shapes...',
    'Grids...',
    'Items...',
    'Languages...',
    'Price variants...',
    'VAT types...',
    'Topic maps...',
    'Customers...',
    'Orders...',
];

export const ImportTenantDumpJourney: React.FC<{
    specFilePath: string;
    tenantIdentifier: string;
    isVerbose?: boolean;
}> = ({ specFilePath, tenantIdentifier, isVerbose = false }) => {
    const { exit } = useApp();

    const [state, dispatch] = useReducer(Reducer, {
        feedbackIndex: 0,
        messages: [],
        isDone: false,
        isImporting: false,
    });

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (!state.isDone && state.isImporting) {
            timer = setTimeout(() => {
                dispatch({ type: 'SHOW_NEW_FEEDBACK', length: feedbacks.length });
            }, 2000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [state.feedbackIndex, state.isImporting]);

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
                                        (eventName: string, message: string) => {
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
            {state.credentials && (
                <CreateTenant state={state} dispatch={dispatch} requestedTenantIdentifier={tenantIdentifier} />
            )}
            {state.isImporting && (
                <>
                    <Text>
                        <Spinner />
                        Importing tenant: <Text dimColor>{feedbacks[state.feedbackIndex]}</Text>
                    </Text>
                </>
            )}
            <Messages title="Trace" messages={state.messages} />
        </>
    );
};

export const CreateTenant: React.FC<{
    requestedTenantIdentifier: string;
    state: State;
    dispatch: Dispatch<Action>;
}> = ({ requestedTenantIdentifier, state, dispatch }) => {
    return (
        <>
            <Text>
                <Spinner />
                Creating tenant: <Text dimColor>{state.tenant?.identifier || requestedTenantIdentifier}</Text>
            </Text>
            {state.tenant?.identifier && state.tenant.identifier !== requestedTenantIdentifier && (
                <Text dimColor>
                    We changed the asked tenant identifier from {requestedTenantIdentifier} to{' '}
                    <Text color={colors.highlight}>{state.tenant.identifier}</Text>,
                </Text>
            )}
        </>
    );
};

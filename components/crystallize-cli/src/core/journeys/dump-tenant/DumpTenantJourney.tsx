import { JsonSpec } from '@crystallize/import-utilities';
import { createSpecDefaults } from '@crystallize/import-utilities/dist/bootstrap-tenant/bootstrapper/index.js';
import { Text, useApp } from 'ink';
import React, { useEffect, useReducer } from 'react';
import { PimAuthenticatedUser, PimCredentials } from '../../../types.js';
import { Messages } from '../../components/Messages.js';
import { SetupCredentials } from '../../components/SetupCredentials.js';
import { Spinner } from '../../components/Spinner.js';
import dumpTenant from '../../use-cases/dumpTenant.js';
import { Reducer } from './reducer.js';

const feedbacks = [
    'Dumping...',
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

export const DumpTenantJourney: React.FC<{
    folder: string;
    tenantIdentifier: string;
    isVerbose?: boolean;
    multiLingual?: boolean;
    excludeOrders?: boolean;
    excludeCustomers?: boolean;
}> = ({ folder, tenantIdentifier, multiLingual = true, excludeOrders = true, excludeCustomers = true }) => {
    const { exit } = useApp();
    const [state, dispatch] = useReducer(Reducer, {
        isDumping: false,
        feedbackIndex: 0,
        messages: [],
        isDone: false,
    });

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (!state.isDone && state.isDumping) {
            timer = setTimeout(() => {
                dispatch({ type: 'SHOW_NEW_FEEDBACK', length: feedbacks.length });
            }, 2000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [state.feedbackIndex, state.isDumping]);

    return (
        <>
            {!state.isDumping && !state.isDone && (
                <SetupCredentials
                    dispatch={(user: PimAuthenticatedUser, credentials: PimCredentials) => {
                        dispatch({ type: 'DUMPING_STARTED' });
                        dumpTenant({
                            tenantIdentifier,
                            folder: folder!,
                            credentials,
                            multiLingual,
                            emit: (eventName: string, message: string) => {
                                dispatch({ type: 'ADD_MESSAGE', message: `${eventName}: ${message}` });
                            },
                            specOptions: {
                                ...createSpecDefaults,
                                orders: !excludeOrders,
                                customers: !excludeCustomers,
                            },
                        }).then((spec: JsonSpec) => {
                            dispatch({ type: 'DUMPING_DONE' });
                            exit();
                        });
                    }}
                />
            )}
            {state.isDumping && (
                <>
                    <Text>
                        <Spinner />
                        Dumping tenant: <Text dimColor>{feedbacks[state.feedbackIndex]}</Text>
                    </Text>
                </>
            )}
            <Messages title="Trace" messages={state.messages} />
        </>
    );
};

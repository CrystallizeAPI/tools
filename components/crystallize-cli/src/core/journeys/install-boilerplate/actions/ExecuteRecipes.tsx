import { Box, Text, useApp } from 'ink';
import { useEffect, useState } from 'react';
import { colors } from '../../../../config/colors.js';
import { Spinner } from '../../../components/Spinner.js';
import setupProject from '../../../use-cases/setupProject.js';
import { useJourney } from '../context/provider.js';
import { FullfilledState, Status } from '../context/types.js';
import React from 'react';
import createTenant from '../../../use-cases/createTenant.js';
import importTentantDump from '../../../use-cases/importTentantDump.js';
import { EVENT_NAMES } from '@crystallize/import-utilities';
import { ImportStatus } from '../../../components/ImportStatus.js';

const feedbacks = [
    'Fetching the dependencies...',
    'Still fetching...',
    'Unpacking...',
    'Preparing files for install...',
    'Installing...',
    'Still installing...',
    'Daydreaming...',
    'Growing that node_modules...',
    'Looking for car keys...',
    'Looking for the car...',
];

export const ExecuteRecipes: React.FC<{ isVerbose: boolean }> = ({ isVerbose }) => {
    const { state, dispatch } = useJourney<FullfilledState>();
    const [output, setOutput] = useState<string[]>(['']);
    const [error, setError] = useState<string[]>(['']);
    const [feedbackIndex, setFeedbackIndex] = useState<number>(0);
    const [status, setStatus] = useState<Status | null>(null);
    const { exit } = useApp();

    useEffect(() => {
        //@todo: this setOutput is actually not working very well
        // somehow the state is not updated... probably because of the useEffect + spawn
        Promise.all([
            setupProject(
                state,
                (data: Buffer) => {
                    if (!isVerbose) {
                        return;
                    }
                    const text = data.toString();
                    const lines = text.split('\n');
                    setOutput([...output, ...lines]);
                },
                (err: Buffer) => {
                    if (!isVerbose) {
                        return;
                    }
                    const text = err.toString();
                    const lines = text.split('\n');
                    setError([...error, ...lines]);
                },
            ),
            (() => {
                if (!state.bootstrapTenant) {
                    return null;
                }
                return createTenant(state.tenant, state.credentials).then(async () => {
                    dispatch.startImport();
                    await importTentantDump({
                        tenantIdentifier: state.tenant.identifier,
                        specFilePath: `${state.folder}/provisioning/tenant/spec.json`,
                        credentials: state.credentials,
                        emit: (eventName: string, message: string | any) => {
                            if (eventName === EVENT_NAMES.STATUS_UPDATE) {
                                setStatus(message);
                                return;
                            }
                            dispatch.addMessage(`${eventName}: ${message}`);
                        },
                    });
                });
            })(),
        ]).then(([readme]) => {
            dispatch.recipesDone(readme);
            // Bootstrapper forces us to exit...
            if (state.bootstrapTenant) {
                exit();
            }
        });
    }, []);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (!state.isFullfilled) {
            timer = setTimeout(() => {
                setFeedbackIndex((feedbackIndex + 1) % feedbacks.length);
            }, 2000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [feedbackIndex]);

    if (state.isFullfilled) {
        return (
            <Text>
                Project has been <Text color={colors.highlight}>installed</Text>.
            </Text>
        );
    }
    return (
        <>
            <Text>
                <Spinner />
                Setting up the project for you: <Text dimColor>{feedbacks[feedbackIndex]}</Text>
            </Text>
            {isVerbose && (
                <Box borderStyle="single" marginRight={2} borderColor="white" flexDirection="column">
                    <Text>{'Trace'}</Text>
                    {output.slice(-10).map((line: string, index: number) => (
                        <Text key={`output${index}`} dimColor>
                            {line}
                        </Text>
                    ))}
                    {error.slice(-10).map((line: string, index: number) => (
                        <Text key={`error${index}`} dimColor color={colors.warning}>
                            {line}
                        </Text>
                    ))}
                </Box>
            )}
            {state.isBoostrapping && (
                <>
                    <Text>
                        <Spinner />
                        Importing tenant data
                    </Text>
                    {status && <ImportStatus status={status} />}
                </>
            )}
        </>
    );
};

import { Box, Newline, Text } from 'ink';
import { useEffect, useState } from 'react';
import { colors } from '../../../../config/colors.js';
import { Spinner } from '../../../components/Spinner.js';
import setupProject from '../../../use-cases/setupProject.js';
import { useJourney } from '../context/provider.js';
import { FullfilledState } from '../context/types.js';
import React from 'react';

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

    useEffect(() => {
        //@todo: this setOutput is actually not working very well
        // somehow the state is not updated... probably because of the useEffect + spawn
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
        ).then((code: number) => {
            if (code === 0) {
                dispatch.recipesDone();
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
            <>
                <Text>
                    That's it! Project is ready to go.
                    <Newline />
                    <Text color={colors.highlight}>$ cd {state.folder}/application && npm run dev</Text>
                </Text>
            </>
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
        </>
    );
};

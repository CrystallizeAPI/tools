import { Box, Newline, Text, useApp } from 'ink';
import React, { useEffect, useState } from 'react';
import { colors } from '../../../../config/colors.js';
import { Markdown } from '../../../components/Markdown.js';
import { Spinner } from '../../../components/Spinner.js';
import { useJourney } from '../context/provider.js';

export const Success: React.FC = () => {
    const { state } = useJourney();
    const [showSpinnerWaiter, setShowSpinnerWaiter] = useState(true);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowSpinnerWaiter(false);
        }, 1500);
        return () => {
            clearTimeout(timeout);
        };
    }, []);
    return (
        <>
            <Newline />
            <Box
                flexDirection="column"
                borderColor={colors.info}
                borderStyle={'bold'}
                alignItems="center"
                width={100}
                marginLeft={2}
            >
                <Text bold>Go fast and prosper.</Text>
                <Text dimColor>The milliseconds are with you!</Text>
                {showSpinnerWaiter ? <Spinner name="aesthetic" /> : <Text>▰▰▰▰▰▰▰</Text>}
                <Box flexDirection="row" width={90}>
                    <Markdown>{state.readme}</Markdown>
                    <Box alignItems="center" alignSelf="center">
                        <Text bold>{'<---  '}</Text>
                        {showSpinnerWaiter ? <Spinner name="runner" /> : <Text>🏃‍♂️</Text>}
                    </Box>
                </Box>

                {showSpinnerWaiter ? <Spinner name="fistBump" /> : <Text>🤜✨🤛</Text>}
                <Newline />
            </Box>
        </>
    );
};

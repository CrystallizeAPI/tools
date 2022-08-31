import { Box, Text } from 'ink';
import { useEffect } from 'react';
import { useJourney } from '../context/provider.js';
import { FullfilledState } from '../context/types.js';
import { colors } from '../../../../config/colors.js';
import downloadBoilerplate from '../../../use-cases/downloadBoilerplate.js';
import { Spinner } from '../../../components/Spinner.js';
import React from 'react';

export const DownloadProject: React.FC = () => {
    const { state, dispatch } = useJourney<FullfilledState>();
    useEffect(() => {
        downloadBoilerplate(state.boilerplate, state.folder)
            .then(() => dispatch.boilerplateDownloaded())
            .catch(console.error);
    }, []);
    if (state.isDownloaded) {
        return (
            <Text>
                The boilerplate has been successfully <Text color={colors.highlight}>downloaded</Text>.
            </Text>
        );
    }
    return (
        <>
            <Box>
                <Text>
                    <Spinner />
                    Downloading the {state.boilerplate.name} boilerplate...
                </Text>
            </Box>
        </>
    );
};

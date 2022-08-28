import { Box, Text } from "ink";
import { useEffect } from "react";
//@ts-ignore
import gittar from 'gittar';
import { useJourney } from "../context/provider.js";
import { FullfilledState } from "../context/types.js";
import { colors } from "../../../../config/colors.js";

export const DownloadProject: React.FC = () => {
    const { state, dispatch } = useJourney<FullfilledState>();
    useEffect(() => {
        const repo = state.boilerplate.git.replace('https://github.com/', '');
        gittar.fetch(repo, { force: true })
            .then(() => gittar.extract(repo, '/tmp/toto'))
            .then(() => dispatch.boilerplateDownloaded())
            .catch(console.error);
        ;
    }, []);
    if (state.isDownloaded) {
        return <Text>
            All right,{' '}
            <Text color={colors.highlight}>downloaded</Text>
        </Text>
    }
    return <>
        <Box>
            <Text>Downloading the {state.boilerplate.name} boilerplate...</Text>
        </Box>
    </>
}

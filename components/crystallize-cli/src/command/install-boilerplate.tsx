import { styles, output } from '../core/ui-modules/console.js';
import { render } from 'ink';
import React from 'react';
import { Box, Text } from 'ink';
import { InstallBoilerplateJourney } from '../core/journeys/install-boilerplate/InstallBoilerplateJourney.js';

export default async (args: string[], flags: any): Promise<number> => {
    try {
        const { waitUntilExit } = render(<App />);
        await waitUntilExit();
    } catch (error: any) {
        output.error(styles.error(error.message));
        return 1;
    }
    return 0;
}

const App: React.FC = () => {
    return <>
        <Box flexDirection="column" padding={1}>
            <Box flexDirection="column" marginBottom={1}>
                <Text>Hi you, let's make something awesome!</Text>
                <InstallBoilerplateJourney />
            </Box>
        </Box>
    </>
}

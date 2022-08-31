import { Newline, render } from 'ink';
import { Box, Text } from 'ink';
import { InstallBoilerplateJourney } from '../core/journeys/install-boilerplate/InstallBoilerplateJourney.js';
import { isDirectoryEmpty, makeDirectory } from '../core/utils/fs-utils.js';
import { styles } from '../core/utils/console.js';

export default async (args: string[], flags: any): Promise<number> => {
    const folder = args[0];
    const tenantIdentifier = args[1];
    const bootstrapTenant = flags.bootstrapTenant;
    const isVerbose = flags.verbose;

    if (!folder || folder.length === 0) {
        throw new Error('Please provide a folder to install the boilerplate into.');
    }

    makeDirectory(folder);
    if (!(await isDirectoryEmpty(folder))) {
        throw new Error(`The folder ${styles.highlight(folder)} is not empty.`);
    }

    const { waitUntilExit } = render(
        <>
            <Box flexDirection="column" padding={1}>
                <Box flexDirection="column" marginBottom={1}>
                    <Text>
                        Hi you, let's make something awesome! <Newline />
                    </Text>
                    <InstallBoilerplateJourney
                        folder={folder}
                        tenantIdentifier={tenantIdentifier}
                        bootstrapTenant={bootstrapTenant}
                        isVerbose={isVerbose}
                    />
                </Box>
            </Box>
        </>,
    );
    await waitUntilExit();
    return 0;
};

import { Newline, render } from 'ink';
import { Box, Text } from 'ink';
import { InstallBoilerplateJourney } from '../core/journeys/install-boilerplate/InstallBoilerplateJourney.js';
import React from 'react';
import createFolderOrFail from '../core/use-cases/createFolderOrFail.js';
import { styles } from '../core/utils/console.js';
import { boilerplates } from '../config/boilerplates.js';
import { Boilerplate } from '../types.js';

export default async (args: string[], flags: any): Promise<number> => {
    const folder = args[0];
    const tenantIdentifier = args[1];
    const boilerplateIndentifier = args[2] || undefined;
    const bootstrapTenant = flags.bootstrapTenant;
    const isVerbose = flags.verbose;
    const isInteractive = flags.interactive;

    if (!isInteractive) {
        throw new Error('Non-interactive mode is not supported for installing a project.');
    }

    await createFolderOrFail(folder, `Please provide a ${styles.highlight('folder')} to install the boilerplate into.`);
    const boilerplate = boilerplates.find((boiler: Boilerplate) => boiler.identifier === boilerplateIndentifier);

    const { waitUntilExit } = render(
        <>
            <Box flexDirection="column" padding={1}>
                <Box flexDirection="column" marginBottom={1}>
                    <Text>
                        Hi you, let's make something awesome! <Newline />
                    </Text>
                    <InstallBoilerplateJourney
                        folder={folder}
                        boilerplate={boilerplate}
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

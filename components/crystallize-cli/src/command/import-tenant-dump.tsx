import { Box, Newline, render, Text } from 'ink';
import React from 'react';
import { colors } from '../config/colors.js';
import { ImportTenantDumpJourney } from '../core/journeys/import-tenant-dump/ImportTenantDumpJourney.js';
import { styles } from '../core/utils/console.js';
import { isFileExists } from '../core/utils/fs-utils.js';

export default async (args: string[], flags: any): Promise<number> => {
    const specFilePath = args[0];
    const tenantIdentifier = args[1] || '';
    const isVerbose = flags.verbose;

    if (!isFileExists(specFilePath)) {
        throw new Error(`The file ${styles.highlight(specFilePath)} does not exist.`);
    }

    if (tenantIdentifier.length === 0) {
        throw new Error(`Please provide a ${styles.highlight('tenant identifier')}.`);
    }

    const { waitUntilExit } = render(
        <>
            <Box flexDirection="column" padding={1}>
                <Box flexDirection="column" marginBottom={1}>
                    <Text>
                        Let's create a new tenant <Text color={colors.highlight}>{tenantIdentifier}</Text>
                        <Newline />
                    </Text>
                    <ImportTenantDumpJourney
                        specFilePath={specFilePath}
                        tenantIdentifier={tenantIdentifier}
                        isVerbose={isVerbose}
                    />
                </Box>
            </Box>
        </>,
    );
    await waitUntilExit();
    return 0;
};

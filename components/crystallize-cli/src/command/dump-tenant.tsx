import { Box, Newline, render, Text } from 'ink';
import React from 'react';
import { colors } from '../config/colors.js';
import { DumpTenantJourney } from '../core/journeys/dump-tenant/DumpTenantJourney.js';
import createFolderOrFail from '../core/use-cases/createFolderOrFail.js';

export default async (args: string[], flags: any): Promise<number> => {
    const folder = args[0];
    const tenantIdentifier = args[1] || '';
    const isVerbose = flags.verbose;

    await createFolderOrFail(folder, 'Please provide a folder to dump the tenant into.');

    if (tenantIdentifier.length === 0) {
        throw new Error('Please provide a tenant identifier.');
    }

    const { waitUntilExit } = render(
        <>
            <Box flexDirection="column" padding={1}>
                <Box flexDirection="column" marginBottom={1}>
                    <Text>
                        Let's dump the tenant <Text color={colors.highlight}>{tenantIdentifier}</Text>
                        <Newline />
                    </Text>
                    <DumpTenantJourney folder={folder} tenantIdentifier={tenantIdentifier} isVerbose={isVerbose} />
                </Box>
            </Box>
        </>,
    );
    await waitUntilExit();
    return 0;
};

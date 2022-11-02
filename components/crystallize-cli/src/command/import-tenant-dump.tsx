import { Box, Newline, render, Text } from 'ink';
import React from 'react';
import { colors } from '../config/colors.js';
import { ImportTenantDumpJourney } from '../core/journeys/import-tenant-dump/ImportTenantDumpJourney.js';
import createTenant from '../core/use-cases/createTenant.js';
import getCredentialsOrFail from '../core/use-cases/getCredentialsOrFail.js';
import importTenantDump from '../core/use-cases/importTentantDump.js';
import { output, styles } from '../core/utils/console.js';
import { fetchAvailableTenantIdentifier } from '../core/utils/crystallize.js';
import { isFileExists } from '../core/utils/fs-utils.js';

export default async (args: string[], flags: any): Promise<number> => {
    const specFilePath = args[0];
    const tenantIdentifier = args[1] || '';
    const isVerbose = flags.verbose;
    const isInteractive = flags.interactive;
    const multiLingual = flags.multiLingual;

    if (!isFileExists(specFilePath)) {
        throw new Error(`The file ${styles.highlight(specFilePath)} does not exist.`);
    }

    if (tenantIdentifier.length === 0) {
        throw new Error(`Please provide a ${styles.highlight('tenant identifier')}.`);
    }

    if (!isInteractive) {
        const credentials = await getCredentialsOrFail();
        output.log(styles.info(`Importing into tenant ${styles.highlight(tenantIdentifier)} ...`));
        const identifier = await fetchAvailableTenantIdentifier(credentials, tenantIdentifier);
        await createTenant({ identifier }, credentials);
        await importTenantDump({
          tenantIdentifier: identifier,
          specFilePath,
          credentials,
          emit: (eventName: string, message: string | any) => {
            output.log(eventName, message);
          },
          multiLingual,
        });
        output.log(styles.info('Tenant is ready.'));
        return 0;
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
                        multiLingual={multiLingual}
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

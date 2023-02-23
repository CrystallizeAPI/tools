import { createSpecDefaults } from '@crystallize/import-utilities/dist/bootstrap-tenant/bootstrapper/index.js';
import { Box, Newline, render, Text } from 'ink';
import React from 'react';
import { colors } from '../config/colors.js';
import { DumpTenantJourney } from '../core/journeys/dump-tenant/DumpTenantJourney.js';
import createFolderOrFail from '../core/use-cases/createFolderOrFail.js';
import dumpTenant from '../core/use-cases/dumpTenant.js';
import getCredentialsOrFail from '../core/use-cases/getCredentialsOrFail.js';
import { output, styles } from '../core/utils/console.js';

export default async (args: string[], flags: any): Promise<number> => {
    const folder = args[0];
    const tenantIdentifier = args[1] || '';
    const isVerbose = flags.verbose;
    const isInteractive = flags.interactive;
    const multiLingual = flags.multiLingual;
    const excludeOrders = flags.excludeOrders;
    const excludeCustomers = flags.excludeCustomers;

    await createFolderOrFail(folder, 'Please provide a folder to dump the tenant into.');

    if (tenantIdentifier.length === 0) {
        throw new Error(`Please provide a ${styles.highlight('tenant identifier')}`);
    }

    if (!isInteractive) {
        const credentials = await getCredentialsOrFail();
        output.log(styles.info(`Dumping tenant ${styles.highlight(tenantIdentifier)} ...`));
        await dumpTenant({
            tenantIdentifier,
            folder,
            credentials,
            multiLingual,
            emit: (eventName: string, message: string) => {
                output.log(eventName, message);
            },
            specOptions: {
                ...createSpecDefaults,
                orders: !excludeOrders,
                customers: !excludeCustomers,
            },
        });
        output.log(styles.info('Tenant dumped.'));
        return 0;
    }

    const { waitUntilExit } = render(
        <>
            <Box flexDirection="column" padding={1}>
                <Box flexDirection="column" marginBottom={1}>
                    <Text>
                        Let's dump the tenant <Text color={colors.highlight}>{tenantIdentifier}</Text>
                        <Newline />
                    </Text>
                    <DumpTenantJourney
                        folder={folder}
                        multiLingual={multiLingual}
                        tenantIdentifier={tenantIdentifier}
                        isVerbose={isVerbose}
                        excludeOrders={excludeOrders}
                        excludeCustomers={excludeCustomers}
                    />
                </Box>
            </Box>
        </>,
    );
    await waitUntilExit();
    return 0;
};

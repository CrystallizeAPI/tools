import { DownloadProject } from './actions/DownloadProject.js';
import { SelectBoilerplate } from './questions/SelectBoilerplate.js';
import { SelectTenant } from './questions/SelectTenant.js';
import { ContextProvider, useJourney } from './context/provider.js';
import { Tips } from '../../components/Tips.js';
import { ExecuteRecipes } from './actions/ExecuteRecipes.js';
import { SetupCredentials } from '../../components/SetupCredentials.js';
import { Boilerplate, PimAuthenticatedUser, PimCredentials } from '../../../types.js';
import { fetchAvailableTenantIdentifier } from '../../utils/crystallize.js';
import { Messages } from '../../components/Messages.js';
import { colors } from '../../../config/colors.js';
import { Text } from 'ink';
import React from 'react';

export const InstallBoilerplateJourney: React.FC<{
    folder: string;
    tenantIdentifier?: string;
    bootstrapTenant?: boolean;
    boilerplate?: Boilerplate;
    isVerbose?: boolean;
}> = ({ folder, tenantIdentifier, bootstrapTenant = false, isVerbose = false, boilerplate }) => {
    return (
        <ContextProvider
            initialState={{
                folder,
                boilerplate,
                bootstrapTenant: !!bootstrapTenant,
                ...(tenantIdentifier
                    ? {
                          tenant: {
                              identifier: tenantIdentifier,
                          },
                      }
                    : {}),
            }}
        >
            <Journey isVerbose={isVerbose} />
        </ContextProvider>
    );
};
const Journey: React.FC<{ isVerbose: boolean }> = ({ isVerbose }) => {
    const { state, dispatch } = useJourney();

    return (
        <>
            <Text>
                Install will happen in directory: <Text color={colors.highlight}>{state.folder}</Text>
            </Text>
            <SelectBoilerplate />
            {state.boilerplate && <SelectTenant />}
            {state.boilerplate && state.tenant?.identifier && state.bootstrapTenant && !state.credentials && (
                <SetupCredentials
                    dispatch={(user: PimAuthenticatedUser, credentials: PimCredentials) => {
                        fetchAvailableTenantIdentifier(credentials, state.tenant!.identifier).then(
                            (newIdentifier: string) => {
                                dispatch.changeTenant({
                                    identifier: newIdentifier,
                                });
                                dispatch.setCredentials(credentials);
                            },
                        );
                    }}
                />
            )}

            {state.isWizardFullfilled && <DownloadProject />}
            {state.isDownloaded && <ExecuteRecipes isVerbose={isVerbose} />}

            <Messages messages={state.messages} />
            {!state.isFullfilled && <Tips />}
        </>
    );
};

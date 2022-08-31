import { createClient } from '@crystallize/js-api-client';
import os from 'os';
import { PimAuthenticatedUser, PimCredentials } from '../../types.js';
import { isFileExists, loadJSON, makeDirectory, removeFile, saveFile } from './fs-utils.js';

const PIM_CREDENTIALS_PATH = `${os.homedir()}/.crystallize/credentials.json`;

export async function hasCredentials(): Promise<boolean> {
    const home = os.homedir();
    makeDirectory(`${home}/.crystallize`);
    if (!isFileExists(PIM_CREDENTIALS_PATH)) {
        return false;
    }
    try {
        const credentials = await getCredentials();
        return !!(credentials.ACCESS_TOKEN_ID && credentials.ACCESS_TOKEN_SECRET);
    } catch {
        return false;
    }
}

export async function getCredentials(): Promise<PimCredentials> {
    return await loadJSON(PIM_CREDENTIALS_PATH);
}

export async function checkCredentials(credentials: PimCredentials): Promise<PimAuthenticatedUser | undefined> {
    const apiClient = createClient({
        tenantIdentifier: '',
        accessTokenId: credentials.ACCESS_TOKEN_ID,
        accessTokenSecret: credentials.ACCESS_TOKEN_SECRET,
    });

    const result = await apiClient
        .pimApi('{ me { id firstName lastName email tenants { tenant { id identifier name } } } }')
        .catch(() => {});
    return result?.me ?? undefined;
}

export async function removeCredentials(): Promise<void> {
    return removeFile(PIM_CREDENTIALS_PATH);
}

export async function saveCredentials(credentials: PimCredentials): Promise<void> {
    const home = os.homedir();
    makeDirectory(`${home}/.crystallize`);
    return saveFile(PIM_CREDENTIALS_PATH, JSON.stringify(credentials));
}

export async function fetchAvailableTenantIdentifier(credentials: PimCredentials, identifier: string): Promise<string> {
    const apiClient = createClient({
        tenantIdentifier: '',
        accessTokenId: credentials.ACCESS_TOKEN_ID,
        accessTokenSecret: credentials.ACCESS_TOKEN_SECRET,
    });
    const result = await apiClient.pimApi(`query {
        tenant {
            suggestIdentifier (
                desired: "${identifier}"
            ) {
                suggestion
            }
        }
    }`);
    return result.tenant?.suggestIdentifier?.suggestion || identifier;
}

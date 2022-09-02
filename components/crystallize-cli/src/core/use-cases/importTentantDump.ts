import { Bootstrapper, EVENT_NAMES, JsonSpec } from '@crystallize/import-utilities';
import { PimCredentials } from '../../types.js';
import { loadJSON } from '../utils/fs-utils.js';

export default async (
    tenantIdentifier: string,
    specFilePath: string,
    credentials: PimCredentials,
    emit: (eventName: string, message: string) => void,
): Promise<void> => {
    const spec: JsonSpec = await loadJSON(specFilePath);
    const bootstrapper = new Bootstrapper();
    bootstrapper.setTenantIdentifier(tenantIdentifier);
    bootstrapper.setAccessToken(credentials.ACCESS_TOKEN_ID, credentials.ACCESS_TOKEN_SECRET);
    bootstrapper.on(EVENT_NAMES.ERROR, (status) => {
        try {
            const error = JSON.parse(status.error);
            emit(EVENT_NAMES.ERROR, `${error.message} (${error.code})`);
        } catch (e) {
            emit(EVENT_NAMES.ERROR, `${status.error}`);
        }
    });
    bootstrapper.setSpec(spec);
    bootstrapper.on(EVENT_NAMES.DONE, (status) => {
        emit(EVENT_NAMES.DONE, `Duration: ${status.duration}`);
    });

    await bootstrapper.start();
};

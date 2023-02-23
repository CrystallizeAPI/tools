import { Bootstrapper, EVENT_NAMES, JsonSpec } from '@crystallize/import-utilities';
import {
    createSpecDefaults,
    ICreateSpec,
} from '@crystallize/import-utilities/dist/bootstrap-tenant/bootstrapper/index.js';
import { PimCredentials } from '../../types.js';
import { saveFile } from '../utils/fs-utils.js';

type Props = {
    tenantIdentifier: string;
    folder: string;
    credentials: PimCredentials;
    emit: (eventName: string, message: string) => void;
    multiLingual?: boolean;
    specOptions?: ICreateSpec;
};
export default async ({
    tenantIdentifier,
    folder,
    credentials,
    emit,
    multiLingual = true,
    specOptions = createSpecDefaults,
}: Props): Promise<JsonSpec> => {
    const bootstrapper = new Bootstrapper();
    bootstrapper.setTenantIdentifier(tenantIdentifier);
    bootstrapper.setAccessToken(credentials.ACCESS_TOKEN_ID, credentials.ACCESS_TOKEN_SECRET);
    bootstrapper.config.multilingual = multiLingual;

    bootstrapper.on(EVENT_NAMES.ERROR, (status) => {
        try {
            const error = JSON.parse(status.error);
            emit(EVENT_NAMES.ERROR, `${error.message} (${error.code})`);
        } catch (e) {
            emit(EVENT_NAMES.ERROR, `${status.error}`);
        }
    });
    const spec = await bootstrapper.createSpec(specOptions);
    await saveFile(`${folder}/spec-${Date.now()}.json`, JSON.stringify(spec));
    return spec;
};

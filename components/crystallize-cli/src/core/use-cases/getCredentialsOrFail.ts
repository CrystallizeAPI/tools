import { PimCredentials } from '../../types.js';
import { checkCredentials, getCredentials, hasCredentials } from '../utils/crystallize.js';

export default async (): Promise<PimCredentials> => {
    if (!(await hasCredentials())) {
        throw new Error('No credentials found.');
    }
    const credentials = await getCredentials();
    const user = await checkCredentials(credentials);
    if (!user) {
        throw new Error('Credentials found are not valid.');
    }
    return credentials;
};

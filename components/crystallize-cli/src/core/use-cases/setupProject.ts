import { FullfilledState } from '../journeys/install-boilerplate/context/types.js';
import { replaceInFile } from '../utils/fs-utils.js';
import { v4 as uuidv4 } from 'uuid';
import run from '../runner.js';

export default async (
    state: FullfilledState,
    onStdOut?: (data: Buffer) => void,
    onStdErr?: (data: Buffer) => void,
): Promise<number> => {
    await replaceInFile(`${state.folder}/provisioning/clone/.env.dist`, [
        {
            search: '##STOREFRONT_IDENTIFIER##',
            replace: `storefront-${state.tenant.identifier}`,
        },
        {
            search: '##CRYSTALLIZE_TENANT_IDENTIFIER##',
            replace: state.tenant.identifier,
        },
        {
            search: '##CRYSTALLIZE_ACCESS_TOKEN_ID##',
            replace: state.credentials?.ACCESS_TOKEN_ID || '',
        },
        {
            search: '##CRYSTALLIZE_ACCESS_TOKEN_SECRET##',
            replace: state.credentials?.ACCESS_TOKEN_SECRET || '',
        },
        {
            search: '##JWT_SECRET##',
            replace: uuidv4(),
        },
    ]);
    if (onStdOut) {
        onStdOut(Buffer.from(`> .env.dist replaced`, 'utf-8'));
    }
    return await run(['bash', `${state.folder}/provisioning/clone/setup.bash`], onStdOut, onStdErr);
};

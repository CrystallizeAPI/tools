import { styles } from '../utils/console.js';
import { isDirectoryEmpty, makeDirectory } from '../utils/fs-utils.js';

export default async (folder: string, message: string) => {
    if (!folder || folder.length === 0) {
        throw new Error(message);
    }

    makeDirectory(folder);
    if (!(await isDirectoryEmpty(folder))) {
        throw new Error(`The folder ${styles.highlight(folder)} is not empty.`);
    }
};

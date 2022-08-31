import fs from 'fs';

export async function isDirectoryEmpty(path: string): Promise<boolean> {
    return fs.promises.readdir(path).then((files) => {
        return files.length === 0;
    });
}

export function makeDirectory(path: string): boolean {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        return true;
    }
    return false;
}

export function isFileExists(path: string): boolean {
    return fs.existsSync(path);
}

export function loadJSON(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, content) => {
            if (err) {
                reject(err);
            } else {
                try {
                    resolve(JSON.parse(content));
                } catch (err) {
                    reject(err);
                }
            }
        });
    });
}

export async function removeFile(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export async function saveFile(path: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export async function replaceInFile(path: string, keyValues: { search: string; replace: string }[]): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, content) => {
            if (err) {
                reject(err);
            } else {
                const newContent = keyValues.reduce((memo: string, keyValue: { search: string; replace: string }) => {
                    return memo.replace(keyValue.search, keyValue.replace);
                }, content);
                saveFile(path, newContent).then(resolve).catch(reject);
            }
        });
    });
}

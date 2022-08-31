import { spawn } from 'child_process';

export default async (
    command: string[],
    onStdOut?: (data: Buffer) => void,
    onStdErr?: (data: Buffer) => void,
    batchingInterval: number = 1000,
): Promise<number> => {
    const outs: string[] = [];
    const errs: string[] = [];

    const interval = setInterval(() => {
        if (onStdOut) {
            onStdOut(Buffer.from(outs.join('\n'), 'utf-8'));
        }
        if (onStdErr) {
            onStdErr(Buffer.from(errs.join('\n'), 'utf-8'));
        }
    }, batchingInterval);

    return new Promise(function (resolve, reject) {
        const process = spawn(command[0], command.slice(1));
        if (onStdOut) {
            process.stdout.on('data', (data: Buffer) => {
                const text = data.toString();
                const lines = text.split('\n').filter((l) => l.length > 0);
                outs.push(...lines);
            });
        }
        if (onStdErr) {
            process.stderr.on('data', (data: Buffer) => {
                const text = data.toString();
                const lines = text.split('\n').filter((l) => l.length > 0);
                errs.push(...lines);
            });
        }
        process.on('error', (error) => {
            clearInterval(interval);
            reject(error);
        });

        process.on('close', (code: number) => {
            clearInterval(interval);
            resolve(code);
        });
    });
};

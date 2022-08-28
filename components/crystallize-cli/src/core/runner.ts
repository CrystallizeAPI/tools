import { execSync } from 'child_process';
import { output, styles } from './ui-modules/console.js';

export function execute(commands: string[][]) {
    commands.every(command => {
        try {
            const stdout = execSync(command.join(' '), { stdio: ['pipe', 'pipe', process.stderr] });
            const cleanStdout = stdout.toString().trim();
            if (cleanStdout.length > 0) {
                output.log(cleanStdout);
            }
        } catch (error: any) {
            output.error(styles.error(error))
            return false;
        }
        return true;
    });
}

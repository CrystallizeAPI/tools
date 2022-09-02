import chalk from 'chalk';
import { colors } from '../../config/colors.js';

class Output {
    private isQuiet: boolean;
    constructor(quiet: boolean) {
        this.isQuiet = quiet;
    }
    set quiet(quiet: boolean) {
        this.isQuiet = quiet;
    }

    log(...args: any) {
        if (!this.isQuiet) {
            console.log(...args);
        }
    }
    error(...args: any) {
        console.error(...args);
    }
}

export const output = new Output(false);

export const styles = {
    warning: chalk.hex(colors.warning),
    info: chalk.hex(colors.info),
    error: chalk.hex(colors.error),
    highlightColor: chalk.hex(colors.highlight),
    section: (message: string) => {
        return `
${chalk.gray('-'.repeat(75))}
${chalk.hex(colors.info)(message)}
${chalk.gray('-'.repeat(75))}
        `;
    },
    success: (message: string) => {
        return `
${chalk.bgGreen(' '.repeat(75))}
${chalk.bgGreen('  ')}${chalk.black.bgGreen(message)}${chalk.bgGreen(' '.repeat(75 - message.length - 2))}
${chalk.bgGreen(' '.repeat(75))}
        `;
    },
    failure: (message: string) => {
        return `
${chalk.bgRed(' '.repeat(75))}
${chalk.bgRed('  ')}${chalk.black.bgRed(message)}${chalk.bgRed(' '.repeat(75 - message.length - 2))}
${chalk.bgRed(' '.repeat(75))}
        `;
    },
    title: (message: string) => {
        return styles.info(` 
==== ${message} ====
${chalk.gray('-'.repeat(10 + message.length))}`);
    },
    highlight: (message: string) => {
        return chalk.hex(colors.highlight)(message);
    },
};

import chalk from 'chalk';
import { colors } from '../../config/colors.js';
export const output = console;

export const styles = {
    warning: chalk.hex(colors.warning),
    info: chalk.hex(colors.info),
    error: chalk.hex(colors.error),
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

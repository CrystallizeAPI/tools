#!/usr/bin/env node

import meow from 'meow';
import help, { helpText } from './command/help.js';
import { output, styles } from './core/utils/console.js';
import installBoilerplate from './command/install-boilerplate.js';
import dumpTenant from './command/dump-tenant.js';
import importTenantDump from './command/import-tenant-dump.js';

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = parseInt(semver[0]);
const minVersion = 16;

if (major < minVersion) {
    output.error(
        styles.error(
            `You are running Node.js v${currentNodeVersion}. Crystallize CLI requires Node ${minVersion} or higher.`,
        ),
    );
    process.exit(1);
}

const commands = {
    install: installBoilerplate,
    dump: dumpTenant,
    import: importTenantDump,
    help,
};

const cli = meow(helpText, {
    importMeta: import.meta,
    flags: {
        quiet: {
            type: 'boolean',
            default: false,
            alias: 'q',
        },
        interactive: {
            type: 'boolean',
            default: true,
            alias: 'i',
        },
        verbose: {
            type: 'boolean',
            default: false,
            alias: 'v',
        },
        bootstrapTenant: {
            type: 'boolean',
            alias: 'b',
            default: false,
        },
        multiLingual: {
            type: 'boolean',
            default: true,
        },
        excludeOrders: {
            type: 'boolean',
            default: true,
        },
        excludeCustomers: {
            type: 'boolean',
            default: true,
        },
    },
});

run(cli.input, cli.flags).then((code) => {
    process.exitCode = code;
    if (code === 0) {
        if (cli.input.length === 0 || cli.input[0] === 'help') {
            return;
        }
        output.log(styles.success('Done!'));
    } else {
        output.log(styles.failure('Exited with errors.'));
    }
    if (cli.flags.verbose) {
        consoleLogMemoryUsage((key: string) => styles.info(key));
    }
    // this is needed to make sure the process exits. The bootstraper is maintaining something.
    process.exit(code);
});

export async function run(args: string[], flags: any): Promise<number> {
    if (flags.quiet) {
        output.quiet = true;
    }
    output.log(styles.title('Crystallize - headless commerce for product storytellers'));
    if (args.length === 0) {
        return help(args.slice(1), flags);
    }
    try {
        const command = commands[args[0] as keyof typeof commands] || help;
        return await command(args.slice(1), flags);
    } catch (exception: any) {
        output.error(styles.error(exception.message));
        return 1;
    }
}

function consoleLogMemoryUsage(colorizedKeyFunc?: (key: string) => string): void {
    //@ts-ignore
    const used: any = process.memoryUsage();
    let outputLines = ['Memory usage:'];
    for (const key in used) {
        const colorizedKey = colorizedKeyFunc ? colorizedKeyFunc(key) : key;
        outputLines.push(`${colorizedKey} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB `);
    }
    output.log(outputLines.join(', ') + '\n');
}

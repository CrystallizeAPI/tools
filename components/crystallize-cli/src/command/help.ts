import { output, styles } from '../core/utils/console.js';

export const helpText = `Usage
$ @crystallize/cli <command>

Arguments:
    install <folder> [<boilerplate>] [<tenantIdentifier>] [-b]: Run the Wizard to install <boilerplate> in <folder> using <tenantIdentifier>
    dump <folder> <tenantIdentifier>: Dump the tenant <tenantIdentifier> to <folder>
    import <specfilePath> <tenantIdentifier>: Import the dump from <specfilePath> to <tenantIdentifier>
    help - Show this help message

Options
	--bootstrap-tenant, -b Bootstrap tenant

Examples
    $ @crystallize/cli install my-ecommerce
`;

export default async (args: string[], flags: any): Promise<number> => {
    output.log(styles.section('Help'));
    output.log(helpText);

    return 0;
};

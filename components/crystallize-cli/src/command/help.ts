import { output, styles } from '../core/utils/console.js';

export const helpText = `Usage
$ @crystallize/cli <command>

Arguments:
    install <folder> [<tenantIdentifier>] [<boilerplate>] [-b]: Run the Wizard to install <boilerplate> into <folder> using <tenantIdentifier>
    dump <folder> <tenantIdentifier>: Dump the tenant <tenantIdentifier> to <folder>
    import <specfilePath> <tenantIdentifier>: Import the dump from <specfilePath> to <tenantIdentifier>
    help - Show this help message

Options
    --bootstrap-tenant, -b Bootstrap tenant (default: false)
    --verbose, -v Verbose output (defaut: false)
    --interactive, -i Interactive mode (default: true)

Examples
    $ @crystallize/cli install ~/my-projects/my-ecommerce
    $ @crystallize/cli install ~/my-projects/my-ecommerce myexistingtenant
    $ @crystallize/cli install ~/my-projects/my-ecommerce myexistingtenant furniture-remix
    $ @crystallize/cli install ~/my-projects/my-ecommerce myexistingtenant furniture-remix -b
    
    $ @crystallize/cli dump ~/my-projects/my-dump-folder myexistingtenant
    $ @crystallize/cli dump ~/my-projects/my-dump-folder myexistingtenant -i=false
    $ @crystallize/cli dump ~/my-projects/my-dump-folder myexistingtenant -i=false -q

    $ @crystallize/cli import ~/my-projects/my-dump-folder/spec.json anewtenant
    $ @crystallize/cli import ~/my-projects/my-dump-folder/spec.json anewtenant -i=false
    $ @crystallize/cli import ~/my-projects/my-dump-folder/spec.json anewtenant -i=false -q
`;

export default async (args: string[], flags: any): Promise<number> => {
    output.log(styles.section('Help'));
    output.log(helpText);

    return 0;
};

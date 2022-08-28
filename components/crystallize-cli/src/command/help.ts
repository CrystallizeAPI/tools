import { output, styles } from "../core/ui-modules/console.js";

export const helpText = `Usage
$ @crystallize/cli <command>

Arguments:
    install <folder> [<boilerplate>] [<tenantIdentifier>]: Run the Wizard to install <boilerplate> in <folder> using <tenantIdentifier>
    dump <folder> <tenantIdentifier>: Dump the tenant <tenantIdentifier> to <folder>
    import <folder> <tenantIdentifier>: Import the dump from <folder> to <tenantIdentifier>
    help - Show this help message
	
Examples
    $ @crystallize/cli install my-ecommerce
`;

export default async (args: string[], flags: any): Promise<number> => {
    output.log(styles.section("Help"));
    output.log(helpText);

    return 0;
}

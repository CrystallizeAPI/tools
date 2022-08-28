import { output, styles } from "../core/ui-modules/console.js";

export default async (args: string[], flags: any): Promise<number> => {
    try {
        output.log("DUMPING");
    } catch (error: any) {
        output.error(styles.error(error.message));
        return 1;
    }
    return 0;
}

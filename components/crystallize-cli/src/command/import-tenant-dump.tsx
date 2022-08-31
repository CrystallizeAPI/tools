import { output, styles } from '../core/utils/console.js';
import React from 'react';

export default async (args: string[], flags: any): Promise<number> => {
    output.log('IMPORT');
    return 0;
};

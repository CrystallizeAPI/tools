import { Box, Text } from 'ink';
import React from 'react';
//@ts-ignore
import ProgressBar from 'ink-progress-bar';

const areaMap = new Map();
areaMap.set('media', 'Media');
areaMap.set('shapes', 'Shapes');
areaMap.set('grids', 'Grids');
areaMap.set('items', 'Items');
areaMap.set('languages', 'Languages');
areaMap.set('priceVariants', 'Price variants');
areaMap.set('vatTypes', 'VAT types');
areaMap.set('topicMaps', 'Topic maps');
areaMap.set('customers', 'Customers');
areaMap.set('orders', 'Orders');

function progressText(progress: number) {
    const arr: string[] = Array.apply(null, Array(20)).map((_) => '-');
    const filled: string[] = Array.apply(null, Array(Math.floor(progress * 20))).map((_) => '=');
    arr.splice(0, filled.length, ...filled);
    return `[${arr.join('')}]`;
}

type Status = Record<
    string,
    {
        progress: number;
        warnings: { message: string; code: number }[];
    }
>;

export const ImportStatus: React.FC<{ status: Status }> = ({ status }) => {
    return (
        <>
            {Object.keys(status).map((key: string) => {
                const name = areaMap.get(key) || key;
                const { progress, warnings } = status[key];
                return (
                    <React.Fragment key={key}>
                        <Box flexDirection="column">
                            <Text>
                                {progressText(progress)} | {(progress * 100).toFixed(0).padStart(3)}% | {name}
                            </Text>
                        </Box>
                        {warnings.map((warn: { message: string; code: number }, index: number) => (
                            <Box key={index} marginLeft={1}>
                                <Text>
                                    ⚠ {warn.message} ({warn.code})
                                </Text>
                            </Box>
                        ))}
                    </React.Fragment>
                );
            })}
        </>
    );
};

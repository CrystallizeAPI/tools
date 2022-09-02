import { Box, Text } from 'ink';
import React from 'react';
import { colors } from '../../config/colors.js';

const areaMap = {
    media: 'Media',
    shapes: 'Shapes',
    grids: 'Grids',
    items: 'Items',
    languages: 'Languages',
    priceVariants: 'Price variants',
    vatTypes: 'VAT types',
    topicMaps: 'Topic maps',
    customers: 'Customers',
    orders: 'Orders',
};

function progressText(progress: number) {
    const arr: string[] = Array.apply(null, Array(20)).map((_) => '-');
    const filled: string[] = Array.apply(null, Array(Math.floor(progress * 20))).map((_) => '=');
    arr.splice(0, filled.length, ...filled);
    return arr.join('');
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
                const name = areaMap[key as keyof typeof areaMap] || key;
                const { progress, warnings } = status[key];
                return (
                    <React.Fragment key={key}>
                        <Box flexDirection="column">
                            <Text>
                                <Text bold color={colors.warning}>
                                    [
                                </Text>
                                <Text dimColor>{progressText(progress)}</Text>
                                <Text bold color={colors.warning}>
                                    ]
                                </Text>{' '}
                                {(progress * 100).toFixed(0).padStart(3)}%{' '}
                                <Text bold color={colors.info}>
                                    {' '}
                                    |
                                </Text>{' '}
                                {name}
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

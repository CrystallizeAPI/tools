import { Box, Newline, Text } from 'ink';
import { colors } from '../../config/colors.js';
import React from 'react';

export const Messages: React.FC<{ title?: string; messages: string[] }> = ({ title = 'Note', messages }) => {
    if (messages.length === 0) {
        return null;
    }
    return (
        <>
            <Newline />
            <Text dimColor>
                {title}
                {messages.length > 1 ? 's' : ''}:
            </Text>
            <Box>
                <Text italic>
                    {messages.map((message, index) => {
                        return (
                            <Text key={index}>
                                <Text dimColor color={colors.warning}>
                                    {'> '}
                                </Text>
                                {message}
                            </Text>
                        );
                    })}
                </Text>
            </Box>
        </>
    );
};

import React from 'react';
import { marked } from 'marked';
import { Text } from 'ink';
import TerminalRenderer, { TerminalRendererOptions } from 'marked-terminal';
import { styles } from '../utils/console.js';

type Props = TerminalRendererOptions & {
    children: string;
};

export const Markdown: React.FC<Props> = ({ children, ...options }: Props) => {
    marked.setOptions({
        renderer: new TerminalRenderer({
            firstHeading: styles.highlightColor.bold,
            link: styles.info.underline,
            href: styles.info.underline,
            ...options,
        }),
    });
    return <Text>{marked(children).trim()}</Text>;
};

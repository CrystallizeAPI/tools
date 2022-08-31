import { Newline, Text } from 'ink';
import Link from 'ink-link';
import { Boilerplate } from '../../types.js';

export const BoilerplateChoice: React.FC<{ boilerplate: Boilerplate }> = ({ boilerplate }) => {
    return (
        <>
            <Text>{boilerplate.name}</Text>
            <Newline />
            <Text dimColor>{boilerplate.baseline}</Text>
            <Newline />
            <Text dimColor>{boilerplate.description}</Text>
            <Newline />
            <Text dimColor>
                {/* @ts-ignore */}
                <Link url={boilerplate.demo}>
                    <Text color="cyan">Demo: {boilerplate.demo}</Text>
                </Link>
            </Text>
        </>
    );
};

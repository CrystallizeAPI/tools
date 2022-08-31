import cliSpinners, { Spinner as TSpinner } from 'cli-spinners';
import { Text } from 'ink';
import { useEffect, useState } from 'react';
import { colors } from '../../config/colors.js';
import React from 'react';

export const Spinner: React.FC<{ name?: string }> = ({ name = 'dots' }) => {
    const [frame, setFrame] = useState(0);
    //@ts-ignore
    const spinner: TSpinner = cliSpinners[name] as TSpinner;
    useEffect(() => {
        const timer = setInterval(() => {
            setFrame((previousFrame) => {
                const isLastFrame = previousFrame === spinner.frames.length - 1;
                return isLastFrame ? 0 : previousFrame + 1;
            });
        }, spinner.interval);
        return () => {
            clearInterval(timer);
        };
    }, [spinner]);
    return (
        <Text bold color={colors.highlight}>
            {spinner.frames[frame]}{' '}
        </Text>
    );
};

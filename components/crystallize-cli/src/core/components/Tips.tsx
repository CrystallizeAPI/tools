
import { Box, Newline, Text } from 'ink';
import Link from 'ink-link';
import { useEffect, useState } from 'react'
import { Tip as TipType } from '../../types.js'
import fetchTips, { staticTips } from '../use-cases/fetchTips.js'

export const Tips: React.FC = () => {
    const [tips, setTips] = useState<TipType[]>(staticTips);
    const [tipIndex, setTipIndex] = useState(0);

    useEffect(() => {
        fetchTips().then((tips: TipType[]) => setTips(tips));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex(Math.floor(Math.random() * (tips.length - 1)));
        }, 4000);
        return () => clearInterval(interval);
    });
    if (tips.length === 0) {
        return null;
    }
    const tip = tips[tipIndex];
    return (
        <>
            <Newline />
            <Text>--------------------------------------</Text>
            <Box>
                <Text italic>
                    <Text>
                        {tip.type === 'blogPost' && `Catch up on our blog post: "${tip.title}"`}
                        {tip.type === 'comic' && `Like comics? Check this out: "${tip.title}"`}
                        {tip.type === '' && `${tip.title}`}
                        <Newline />
                        {/* @ts-ignore */}
                        <Link url={tip.url}>{tip.url}</Link>
                    </Text>
                </Text>
            </Box>
        </>
    );
}

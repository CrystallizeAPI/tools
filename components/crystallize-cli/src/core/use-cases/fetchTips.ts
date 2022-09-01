import { createCatalogueFetcher, createClient } from '@crystallize/js-api-client';
import { Tip } from '../../types';

export const staticTips: Tip[] = [
    {
        title: 'Want to learn more about Crystallize? Check out',
        url: 'https://crystallize.com/learn',
        type: '',
    },
];
export default async (): Promise<Tip[]> => {
    const apiClient = createClient({
        tenantIdentifier: 'crystallize_marketing',
    });
    const fetcher = createCatalogueFetcher(apiClient);
    const tree = {
        subtree: {
            __args: {
                first: 10,
            },
            edges: {
                node: {
                    name: true,
                    path: true,
                },
            },
        },
    };
    const query = {
        blogPosts: {
            __aliasFor: 'catalogue',
            __args: {
                path: '/blog',
                language: 'en',
            },
            ...tree,
        },
        comics: {
            __aliasFor: 'catalogue',
            __args: {
                path: '/comics',
                language: 'en',
            },
            ...tree,
        },
    };

    const data: any = await fetcher(query).catch(console.error);
    return [
        ...staticTips,
        ...data.blogPosts.subtree.edges.map(({ node }: { node: { name: string; path: string } }) => ({
            title: node.name,
            url: `https://crystallize.com${node.path}`,
            type: 'blogPost',
        })),
        ...data.comics.subtree.edges.map(({ node }: { node: { name: string; path: string } }) => ({
            title: node.name,
            url: `https://crystallize.com${node.path}`,
            type: 'comic',
        })),
    ];
};

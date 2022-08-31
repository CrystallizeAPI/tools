import { Boilerplate } from '../../types';
//@ts-ignore
import gittar from 'gittar';

export default async (boilerplate: Boilerplate, destination: string) => {
    const repo = boilerplate.git.replace('https://github.com/', '');
    await gittar.fetch(repo, { force: true });
    await gittar.extract(repo, destination);
};

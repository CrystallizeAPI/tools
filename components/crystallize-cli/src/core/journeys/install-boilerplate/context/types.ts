import { Boilerplate, Tenant } from '../../../../types.js';

export type Action = { type: 'SET_BOILERPLATE'; item: Boilerplate } | { type: 'SET_TENANT'; item: Tenant } | { type: 'BOILERPLATE_DOWNLOADED' } | { type: 'RECIPES_DONE' };

export type Actions = {
    setBoilerplate: (item: Boilerplate) => void;
    setTenant: (item: Tenant) => void;
    boilerplateDownloaded: () => void;
    recipesDone: () => void;
};
export type Dispatch = (action: Action) => void;

export type State = {
    boilerplate?: Boilerplate;
    tenant?: Tenant;
    isWizardFullfilled: boolean;
    isDownloaded: boolean;
    isFullfilled: boolean;
};

export type FullfilledState = Required<State>;

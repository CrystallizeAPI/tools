import { Boilerplate, PimCredentials, Tenant } from '../../../../types.js';

export type Action =
    | { type: 'SET_BOILERPLATE'; item: Boilerplate }
    | { type: 'SET_TENANT'; item: Tenant }
    | { type: 'CHANGE_TENANT'; item: Tenant }
    | { type: 'BOILERPLATE_DOWNLOADED' }
    | { type: 'SET_CREDENTIALS'; credentials: PimCredentials }
    | { type: 'RECIPES_DONE' };

export type Actions = {
    setBoilerplate: (item: Boilerplate) => void;
    setTenant: (item: Tenant) => void;
    boilerplateDownloaded: () => void;
    recipesDone: () => void;
    setCredentials: (credentials: PimCredentials) => void;
    changeTenant: (tenant: Tenant) => void;
};
export type Dispatch = (action: Action) => void;

export type State = {
    folder: string;
    boilerplate?: Boilerplate;
    tenant?: Tenant;
    isWizardFullfilled: boolean;
    bootstrapTenant: boolean;
    credentials?: PimCredentials;
    isDownloaded: boolean;
    isFullfilled: boolean;
    messages: string[];
};

export type InitialState = Pick<State, 'folder' | 'tenant' | 'bootstrapTenant'>;

export type FullfilledState = Required<State>;

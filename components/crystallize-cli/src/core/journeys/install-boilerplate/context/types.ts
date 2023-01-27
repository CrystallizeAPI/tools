import { Boilerplate, PimCredentials, Tenant } from '../../../../types.js';

export type Action =
    | { type: 'SET_BOILERPLATE'; item: Boilerplate }
    | { type: 'SET_TENANT'; item: Tenant }
    | { type: 'CHANGE_TENANT'; item: Tenant }
    | { type: 'BOILERPLATE_DOWNLOADED' }
    | { type: 'SET_BOOTSTRAP_TENANT' }
    | { type: 'SET_CREDENTIALS'; credentials: PimCredentials }
    | { type: 'RECIPES_DONE'; readme: string }
    | { type: 'ADD_MESSAGE'; message: string }
    | { type: 'IMPORT_STARTED' };

export type Actions = {
    setBoilerplate: (item: Boilerplate) => void;
    setTenant: (item: Tenant) => void;
    boilerplateDownloaded: () => void;
    recipesDone: (readme: string) => void;
    setCredentials: (credentials: PimCredentials) => void;
    setBootstrapTenant: () => void;
    changeTenant: (tenant: Tenant) => void;
    startImport: () => void;
    addMessage: (message: string) => void;
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
    isBoostrapping: boolean;
    readme: string;
};

export type InitialState = Pick<State, 'folder' | 'tenant' | 'bootstrapTenant' | 'boilerplate'>;

export type FullfilledState = Required<State>;

export type Status = Record<
    string,
    {
        progress: number;
        warnings: { message: string; code: number }[];
    }
>;

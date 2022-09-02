import { PimCredentials, Tenant } from '../../../types.js';

export type Action =
    | { type: 'SHOW_NEW_FEEDBACK'; length: number }
    | { type: 'SET_CREDENTIALS'; credentials: PimCredentials }
    | { type: 'IMPORT_STARTED' }
    | { type: 'IMPORT_DONE' }
    | { type: 'CHANGE_TENANT'; item: Tenant }
    | { type: 'ADD_MESSAGE'; message: string };

export type State = {
    feedbackIndex: number;
    messages: string[];
    isDone: boolean;
    isImporting: boolean;
    tenant?: Tenant;
    credentials?: PimCredentials;
};
export function Reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SHOW_NEW_FEEDBACK':
            return {
                ...state,
                feedbackIndex: (state.feedbackIndex + 1) % action.length,
            };
        case 'IMPORT_STARTED':
            return {
                ...state,
                isImporting: true,
                isDone: false,
            };
        case 'IMPORT_DONE':
            return {
                ...state,
                isImporting: false,
                isDone: true,
            };
        case 'SET_CREDENTIALS': {
            return {
                ...state,
                credentials: action.credentials,
            };
        }
        case 'CHANGE_TENANT': {
            if (state.tenant?.identifier === action.item.identifier) {
                return state;
            }
            return {
                ...state,
                tenant: action.item,
            };
        }
        case 'ADD_MESSAGE': {
            return {
                ...state,
                messages: [...state.messages, `${action.message}`],
            };
        }
        default: {
            throw new Error('Unhandled action type');
        }
    }
}

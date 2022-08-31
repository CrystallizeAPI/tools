import { Boilerplate, PimCredentials, Tenant } from '../../../../types.js';
import { Action, Actions, Dispatch, State } from './types.js';

function isWizardFullfilled(state: State): boolean {
    if (state.bootstrapTenant && !state.credentials) {
        return false;
    }

    return state.boilerplate !== undefined && state.tenant !== undefined;
}

export function Reducer(state: State, action: Action): State {
    const newState = (() => {
        switch (action.type) {
            case 'SET_BOILERPLATE': {
                return {
                    ...state,
                    boilerplate: action.item,
                };
            }
            case 'SET_TENANT': {
                return {
                    ...state,
                    tenant: action.item,
                };
            }
            case 'CHANGE_TENANT': {
                if (state.tenant?.identifier === action.item.identifier) {
                    return state;
                }
                return {
                    ...state,
                    tenant: action.item,
                    messages: [
                        ...state.messages,
                        `We changed the asked tenant identifier from ${state.tenant?.identifier} to ${action.item.identifier}`,
                    ],
                };
            }
            case 'BOILERPLATE_DOWNLOADED': {
                return {
                    ...state,
                    isDownloaded: true,
                };
            }
            case 'RECIPES_DONE': {
                return {
                    ...state,
                    isFullfilled: true,
                };
            }
            case 'SET_CREDENTIALS': {
                return {
                    ...state,
                    credentials: action.credentials,
                };
            }
            default: {
                throw new Error('AppContext - Unhandled action type');
            }
        }
    })();

    return {
        ...newState,
        isWizardFullfilled: isWizardFullfilled(newState),
    };
}

export function mapToReducerActions(dispatch: Dispatch): Actions {
    return {
        setBoilerplate: (item: Boilerplate) => dispatch({ type: 'SET_BOILERPLATE', item }),
        setTenant: (item: Tenant) => dispatch({ type: 'SET_TENANT', item }),
        boilerplateDownloaded: () => dispatch({ type: 'BOILERPLATE_DOWNLOADED' }),
        recipesDone: () => dispatch({ type: 'RECIPES_DONE' }),
        setCredentials: (credentials: PimCredentials) => dispatch({ type: 'SET_CREDENTIALS', credentials }),
        changeTenant: (item: Tenant) => dispatch({ type: 'CHANGE_TENANT', item }),
    };
}

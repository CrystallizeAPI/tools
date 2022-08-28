import { Boilerplate, Tenant } from '../../../../types.js';
import { Action, Actions, Dispatch, State } from './types.js';


function isWizardFullfilled(state: State): boolean {
    return state.boilerplate !== undefined && state.tenant !== undefined;
}

export function Reducer(state: State, action: Action): State {
    const newState = (() => {
        switch (action.type) {
            case 'SET_BOILERPLATE': {
                return {
                    ...state,
                    boilerplate: action.item
                }
            }
            case 'SET_TENANT': {
                return {
                    ...state,
                    tenant: action.item
                }
            }
            case 'BOILERPLATE_DOWNLOADED': {
                return {
                    ...state,
                    isDownloaded: true
                }
            }
            case 'RECIPES_DONE': {
                return {
                    ...state,
                    isFullfilled: true
                }
            }
            default: {
                throw new Error('AppContext - Unhandled action type');
            }
        }
    })();

    return {
        ...newState,
        isWizardFullfilled: isWizardFullfilled(newState)
    }
}

export function mapToReducerActions(dispatch: Dispatch): Actions {
    return {
        setBoilerplate: (item: Boilerplate) => dispatch({ type: 'SET_BOILERPLATE', item }),
        setTenant: (item: Tenant) => dispatch({ type: 'SET_TENANT', item }),
        boilerplateDownloaded: () => dispatch({ type: 'BOILERPLATE_DOWNLOADED' }),
        recipesDone: () => dispatch({ type: 'RECIPES_DONE' })
    };
}

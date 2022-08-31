import * as React from 'react';
import { FunctionComponent } from 'react';
import { mapToReducerActions, Reducer } from './reducer.js';
import { Actions, Dispatch, InitialState, State } from './types.js';

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

const initiateState = (state: InitialState): State => {
    return {
        folder: state.folder,
        tenant: state.tenant,
        boilerplate: undefined,
        bootstrapTenant: state.bootstrapTenant,
        isWizardFullfilled: false,
        isDownloaded: false,
        isFullfilled: false,
        messages: [],
    };
};

export const ContextProvider: FunctionComponent<{
    children: React.ReactNode;
    initialState: InitialState;
}> = ({ children, initialState }) => {
    const [state, dispatch] = React.useReducer(Reducer, initiateState(initialState));
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
};

function useContextState<T = State>(): T {
    const context = React.useContext(StateContext);
    if (context === undefined) {
        throw new Error('useContextState must be used within the ContextProvider.');
    }
    return context as unknown as T;
}

function useContextDispatch() {
    const context = React.useContext(DispatchContext);
    if (context === undefined) {
        throw new Error('useContextDispatch must be used within the ContextProvider.');
    }
    return context;
}

export function useJourney<T = State>(): { state: T; dispatch: Actions } {
    const actions = mapToReducerActions(useContextDispatch());
    const state = useContextState<T>();
    return {
        state,
        dispatch: actions,
    };
}

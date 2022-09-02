import { createContext, FunctionComponent, ReactNode, useContext, useReducer } from 'react';
import { mapToReducerActions, Reducer } from './reducer.js';
import { Actions, Dispatch, InitialState, State } from './types.js';
import React from 'react';

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

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
        isBoostrapping: false,
    };
};

export const ContextProvider: FunctionComponent<{
    children: ReactNode;
    initialState: InitialState;
}> = ({ children, initialState }) => {
    const [state, dispatch] = useReducer(Reducer, initiateState(initialState));
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
};

function useContextState<T = State>(): T {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error('useContextState must be used within the ContextProvider.');
    }
    return context as unknown as T;
}

function useContextDispatch() {
    const context = useContext(DispatchContext);
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

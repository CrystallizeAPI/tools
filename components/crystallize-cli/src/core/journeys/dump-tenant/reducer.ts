type Action =
    | { type: 'SHOW_NEW_FEEDBACK'; length: number }
    | { type: 'DUMPING_STARTED' }
    | { type: 'DUMPING_DONE' }
    | { type: 'ADD_MESSAGE'; message: string };

type State = {
    isDumping: boolean;
    feedbackIndex: number;
    messages: string[];
    isDone: boolean;
};
export function Reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SHOW_NEW_FEEDBACK':
            return {
                ...state,
                feedbackIndex: (state.feedbackIndex + 1) % action.length,
            };
        case 'DUMPING_STARTED':
            return {
                ...state,
                isDumping: true,
                isDone: false,
                messages: [],
            };
        case 'DUMPING_DONE': {
            return {
                ...state,
                isDumping: false,
                isDone: true,
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

// React-like implementation without React

// 1. useState-like implementation
function useState(initialValue) {
    let state = initialValue;
    const listeners = [];

    function setState(newValue) {
        state = newValue;
        listeners.forEach(listener => listener(state));
    }

    function getState() {
        return state;
    }

    function subscribe(listener) {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }

    return [getState, setState, subscribe];
}

// 2. useReducer-like implementation
function useReducer(reducer, initialState) {
    const [getState, setState, subscribe] = useState(initialState);

    function dispatch(action) {
        const currentState = getState();
        const newState = reducer(currentState, action);
        setState(newState);
    }

    return [getState, dispatch, subscribe];
}

// 3. Action Types (like in Redux)
const ActionTypes = {
    UPDATE_NAME: 'UPDATE_NAME',
    UPDATE_EMAIL: 'UPDATE_EMAIL',
    RESET_FORM: 'RESET_FORM'
};

// 4. Action Creators (like in Redux)
const actions = {
    updateName: (name) => ({
        type: ActionTypes.UPDATE_NAME,
        payload: name
    }),
    updateEmail: (email) => ({
        type: ActionTypes.UPDATE_EMAIL,
        payload: email
    }),
    resetForm: () => ({
        type: ActionTypes.RESET_FORM
    })
};

// 5. Reducer (exactly like React/Redux)
function formReducer(state, action) {
    switch (action.type) {
        case ActionTypes.UPDATE_NAME:
            return {
                ...state,
                name: action.payload
            };
        case ActionTypes.UPDATE_EMAIL:
            return {
                ...state,
                email: action.payload
            };
        case ActionTypes.RESET_FORM:
            return {
                name: '',
                email: ''
            };
        default:
            return state;
    }
}

// 6. Component-like implementation
function UserForm() {
    // Just like in React: const [state, dispatch] = useReducer(reducer, initialState)
    const [getState, dispatch, subscribe] = useReducer(formReducer, {
        name: '',
        email: ''
    });

    // Create UI elements (this would be JSX in React)
    const form = document.createElement('div');
    
    // Name input (like <input value={state.name} onChange={e => dispatch(updateName(e.target.value))} />)
    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Name';
    nameInput.addEventListener('input', (e) => {
        dispatch(actions.updateName(e.target.value));
    });

    // Email input
    const emailInput = document.createElement('input');
    emailInput.placeholder = 'Email';
    emailInput.addEventListener('input', (e) => {
        dispatch(actions.updateEmail(e.target.value));
    });

    // Reset button (like <button onClick={() => dispatch(resetForm())}>Reset</button>)
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => {
        dispatch(actions.resetForm());
    });

    // State display (like {JSON.stringify(state)})
    const stateDisplay = document.createElement('pre');

    // Add to DOM (like return <div>...</div>)
    form.appendChild(nameInput);
    form.appendChild(emailInput);
    form.appendChild(resetButton);
    form.appendChild(stateDisplay);

    // Subscribe to state changes (like React's auto-rerender)
    subscribe(state => {
        // Update UI when state changes (like React's reconciliation)
        nameInput.value = state.name;
        emailInput.value = state.email;
        stateDisplay.textContent = JSON.stringify(state, null, 2);
    });

    return form;
}

// 7. App Container (like React's root)
function App() {
    const container = document.createElement('div');
    container.appendChild(UserForm());
    return container;
}

// 8. Mount to DOM (like ReactDOM.render)
function mount(component, rootElement) {
    rootElement.appendChild(component());
}

// Usage
// Like ReactDOM.render(<App />, document.getElementById('root'))
document.addEventListener('DOMContentLoaded', () => {
    mount(App, document.body);
});

// 9. DevTools-like logging (like Redux DevTools)
const logStateChange = (action, prevState, nextState) => {
    console.group('Action:', action.type);
    console.log('Previous State:', prevState);
    console.log('Action:', action);
    console.log('Next State:', nextState);
    console.groupEnd();
};

/* Use in HTML:
<!DOCTYPE html>
<html>
<head>
    <title>React-like Reducer</title>
    <style>
        input, button { margin: 10px; }
        pre { background: #f0f0f0; padding: 10px; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script src="react-like-reducer.js"></script>
</body>
</html>
*/

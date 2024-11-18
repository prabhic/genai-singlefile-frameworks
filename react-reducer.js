// 1. Create a simple store implementation
class Store {
    constructor(reducer, initialState = {}) {
        this.reducer = reducer;
        this.state = initialState;
        this.listeners = [];
    }

    // Get current state
    getState() {
        return this.state;
    }

    // Subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Dispatch action to update state
    dispatch(action) {
        this.state = this.reducer(this.state, action);
        this.listeners.forEach(listener => listener(this.state));
    }
}

// 2. Define our reducer
function userReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_NAME':
            return {
                ...state,
                name: action.payload
            };
        case 'UPDATE_EMAIL':
            return {
                ...state,
                email: action.payload
            };
        case 'RESET':
            return {
                name: '',
                email: ''
            };
        default:
            return state;
    }
}

// 3. Create the UI handler
class UserInterface {
    constructor(store) {
        this.store = store;
        this.setupUI();
        
        // Subscribe to store changes
        this.unsubscribe = store.subscribe(state => this.updateUI(state));
    }

    setupUI() {
        // Create UI elements
        this.container = document.createElement('div');
        
        // Name input
        this.nameInput = document.createElement('input');
        this.nameInput.placeholder = 'Enter name';
        this.nameInput.addEventListener('input', (e) => {
            store.dispatch({
                type: 'UPDATE_NAME',
                payload: e.target.value
            });
        });

        // Email input
        this.emailInput = document.createElement('input');
        this.emailInput.placeholder = 'Enter email';
        this.emailInput.addEventListener('input', (e) => {
            store.dispatch({
                type: 'UPDATE_EMAIL',
                payload: e.target.value
            });
        });

        // Reset button
        this.resetButton = document.createElement('button');
        this.resetButton.textContent = 'Reset';
        this.resetButton.addEventListener('click', () => {
            store.dispatch({ type: 'RESET' });
        });

        // State display
        this.stateDisplay = document.createElement('pre');

        // Append elements
        this.container.appendChild(this.nameInput);
        this.container.appendChild(this.emailInput);
        this.container.appendChild(this.resetButton);
        this.container.appendChild(this.stateDisplay);
        document.body.appendChild(this.container);
    }

    updateUI(state) {
        // Update inputs to reflect state
        this.nameInput.value = state.name;
        this.emailInput.value = state.email;
        
        // Show current state
        this.stateDisplay.textContent = JSON.stringify(state, null, 2);
    }

    // Cleanup
    destroy() {
        this.unsubscribe();
        this.container.remove();
    }
}

// 4. Usage
const initialState = {
    name: '',
    email: ''
};

// Create store
const store = new Store(userReducer, initialState);

// Create UI
const ui = new UserInterface(store);

// 5. Log state changes (like Redux DevTools)
store.subscribe(state => {
    console.log('State updated:', state);
});

// 6. Example of dispatching actions manually
function exampleActions() {
    // Update name
    store.dispatch({
        type: 'UPDATE_NAME',
        payload: 'John Doe'
    });

    // Update email
    store.dispatch({
        type: 'UPDATE_EMAIL',
        payload: 'john@example.com'
    });

    // Reset form
    setTimeout(() => {
        store.dispatch({ type: 'RESET' });
    }, 2000);
}

// Run example
exampleActions();

/* Usage in HTML:
<!DOCTYPE html>
<html>
<head>
    <title>Plain JS Reducer</title>
    <style>
        input, button { margin: 10px; }
        pre { background: #f0f0f0; padding: 10px; }
    </style>
</head>
<body>
    <script src="plain-reducer.js"></script>
</body>
</html>
*/

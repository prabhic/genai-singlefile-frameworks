// Custom useEffect implementation
function useEffect(callback, dependencies) {
    const store = {
        previousDeps: null,
        cleanup: null
    };

    // Check if dependencies changed
    function depsChanged() {
        if (!store.previousDeps) return true;
        if (!dependencies) return true;
        return !dependencies.every((dep, i) => dep === store.previousDeps[i]);
    }

    // Run effect if deps changed
    if (depsChanged()) {
        // Run cleanup if exists
        if (typeof store.cleanup === 'function') {
            store.cleanup();
        }

        // Run effect and store cleanup
        store.cleanup = callback();
        store.previousDeps = dependencies;
    }
}

// Example usage
function UserComponent() {
    const [getState, dispatch, subscribe] = useReducer(userReducer, {
        name: '',
        data: null
    });

    // Effect to fetch data when name changes
    useEffect(() => {
        const controller = new AbortController();
        
        async function fetchData() {
            try {
                const response = await fetch(`/api/user/${getState().name}`, {
                    signal: controller.signal
                });
                const data = await response.json();
                dispatch({ type: 'SET_DATA', payload: data });
            } catch (error) {
                if (!controller.signal.aborted) {
                    dispatch({ type: 'SET_ERROR', payload: error });
                }
            }
        }

        if (getState().name) {
            fetchData();
        }

        // Cleanup function
        return () => {
            controller.abort();
        };
    }, [getState().name]);

    // UI setup as before
    const container = document.createElement('div');
    // ... rest of the UI setup

    return container;
}

// Enhanced reducer to handle async state
function userReducer(state, action) {
    switch (action.type) {
        case 'SET_NAME':
            return { ...state, name: action.payload };
        case 'SET_DATA':
            return { ...state, data: action.payload, error: null };
        case 'SET_ERROR':
            return { ...state, error: action.payload, data: null };
        default:
            return state;
    }
}

// Test Component
function TestEffects() {
    const [getState, dispatch] = useReducer(userReducer, {
        count: 0,
        timer: null
    });

    // Effect 1: Setup/cleanup timer
    useEffect(() => {
        const timerId = setInterval(() => {
            dispatch({ type: 'INCREMENT' });
        }, 1000);

        return () => clearInterval(timerId);
    }, []); // Empty deps = run once

    // Effect 2: Log count changes
    useEffect(() => {
        console.log('Count changed:', getState().count);
    }, [getState().count]);

    const div = document.createElement('div');
    div.textContent = `Count: ${getState().count}`;
    return div;
}

import { createContext, useEffect, useReducer } from "react";
import { projectAuth } from "../firebase/config";

export const AuthContext = createContext() 

export const authReducer = (state, action) => {
    // use switch to check action type
    switch (action.type) {
        case 'LOGIN':
            // update the user property as whatever is passed in as the paylod action
            return {...state,user: action.payload}
        case 'LOGOUT':
            return {...state,user: null}
        case 'AUTH_IS_READY':
            return {...state,user: action.payload, authIsReady: true}
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        authIsReady: false
    })

    // when react app is first rendered or reload the page
    useEffect(() => {
        const unsub = projectAuth.onAuthStateChanged((user) => {
            dispatch({ type: 'AUTH_IS_READY', payload: user })
            unsub()
        }) 
    }, [])
    console.log('AuthContext state:', state)
    return (
        // add dispatch so that later dispatch method or fxn can be used inside custom hooks to update context value 
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}
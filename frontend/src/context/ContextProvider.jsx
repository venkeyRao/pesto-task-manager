

import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    currentUser: null,
    token: null,
    setUser: () => { },
    setToken: () => { },
})

export const ContextProvider = ({ children }) => {
    const [user, _setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? savedUser : null; 
    });
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    const setUser = (user) => {
        _setUser(user);
        if (user) {
            localStorage.setItem('user', user);
        } else {
            localStorage.removeItem('user');
        }
    }
    

    return (
        <StateContext.Provider value={{
            user,
            setUser,
            token,
            setToken,
        }}>
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);
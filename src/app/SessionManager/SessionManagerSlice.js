import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    loggedIn: undefined,
}

const SessionManagerState = createSlice({
    name: "SessionManagerState",
    initialState: initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            const { value } = action.payload
            state.loggedIn = value
        }
    }
})

export const {
    setLoggedIn
} = SessionManagerState.actions

export const LoggedInSelector = (state) => {
    return state.sessionManager.loggedIn
}

export const getUser = () => {
    return Cookies.get('session')
}

export default SessionManagerState.reducer
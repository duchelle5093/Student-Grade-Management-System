import { createSlice } from '@reduxjs/toolkit';

interface AuthSliceState{
    isAuthenticated: boolean | null,
    tokenExpiresIn: number
}

const initialState: AuthSliceState = {
    isAuthenticated: null,
    tokenExpiresIn: 120
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        markAsAuthenticated(state){
            state.isAuthenticated = true
        },
        markAsUnauthenticated(state){
            state.isAuthenticated = false
        },

    }
})

export const authReducer = slice.reducer
export const { markAsUnauthenticated, markAsAuthenticated } = slice.actions

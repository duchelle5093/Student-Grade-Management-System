import { createSlice } from '@reduxjs/toolkit';
import { LoginResDto } from '../../api/reponse-dto/auth.res.dto';
import { processLogin } from './actions';

interface AuthSliceState{
    isAuthenticated: boolean | null,
    tokenExpiresIn: number
    userInfo : LoginResDto
}

const initialState: AuthSliceState = {
    isAuthenticated: null,
    tokenExpiresIn: 120,
    userInfo: {} as LoginResDto
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
    },

     extraReducers: (builder) => {
        builder
          .addCase(processLogin.fulfilled, (state, action) => {
            state.userInfo = action.payload
          })
        },
    
})

export const authReducer = slice.reducer
export const { markAsUnauthenticated, markAsAuthenticated } = slice.actions

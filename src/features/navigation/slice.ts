import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationSliceState{
    path: string | null
}

const initialState: NavigationSliceState = {
    path: null
}

const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        navigateTo(state, action: PayloadAction<string>){
            state.path = action.payload
        }
    }
})

export const navigationReducer = navigationSlice.reducer
export const { navigateTo  } = navigationSlice.actions

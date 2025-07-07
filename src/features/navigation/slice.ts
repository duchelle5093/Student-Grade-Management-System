import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationSliceState{
    path: string | null
}

const initialState: NavigationSliceState = {
    path: null
}

const slice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        navigateTo(state, action: PayloadAction<string>){
            state.path = action.payload
        }
    }
})

export const navigationReducer = slice.reducer
export const { navigateTo  } = slice.actions

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { userProfileResDto } from '../../api/reponse-dto/user.res.dto';
import {StudentDataResDto} from "../../api/reponse-dto/student.res.dto.ts";
import {fetchStudents} from "./actions.ts";

interface UserSliceState {
  profile: userProfileResDto;
  students:StudentDataResDto[];
}

const initialState: UserSliceState = {
  profile: {} as userProfileResDto,
  students: [] ,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadUserProfile(state, action: PayloadAction<userProfileResDto>) {
      state.profile = action.payload;
    },
  },
    extraReducers: (builder) => {
        builder
        .addCase(fetchStudents.fulfilled, (state, action) => {
            state.students = action.payload;
        })
    },
});

export const userReducer = slice.reducer;
export const {
  loadUserProfile,
} = slice.actions;

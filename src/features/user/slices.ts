import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { studentResDto, userProfileResDto } from '../../api/reponse-dto/user.res.dto';

interface UserSliceState {
  profile: userProfileResDto;
  students: studentResDto[];
}

const initialState: UserSliceState = {
  profile: {} as userProfileResDto,
  students: [],
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadUserProfile(state, action: PayloadAction<userProfileResDto>) {
      state.profile = action.payload;
    },
    loadStudents(state, action: PayloadAction<studentResDto[]>) {
      state.students = action.payload;
    },
  },
});

export const userReducer = slice.reducer;
export const {
  loadUserProfile,
  loadStudents
} = slice.actions;

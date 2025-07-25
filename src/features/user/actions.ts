import { createAsyncThunk } from "@reduxjs/toolkit";
import { loadUserProfile } from "./slices";
import { userService } from "../../api/configs";

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await userService.getProfile();
      dispatch(loadUserProfile(response));
      return response;
    } catch (e: any) {
      return rejectWithValue(e.response);
    }
  }
);

export const fetchStudents = createAsyncThunk(
  'profile/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getStudents();
      return response;
    } catch (e: any) {
      return rejectWithValue(e.response);
    }
  }
);


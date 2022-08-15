import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../api";

interface AuthActionParam {
    purpose: string;
    obj: formState
}

export const auth = createAsyncThunk(
    'user/auth',
    async ({ purpose, obj }: AuthActionParam, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await API.post(`/${purpose}`, obj);
            if (data.error) return rejectWithValue(data.error);
            localStorage.setItem("userData", JSON.stringify(data));
            return fulfillWithValue(data);
        } catch (error: any) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

interface UserState {
    data: any;
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    message: string | null;
}

const initialState = {
    data: null,
    status: 'idle',
} as UserState


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(auth.pending, (state) => {
            state.status = 'pending';
        });
        builder.addCase(auth.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.data = action.payload;
        });
        builder.addCase(auth.rejected, (state, action) => {
            state.status = 'failed';
            state.data = { message: action.payload };
        });
    }
});

export default userSlice.reducer
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
    const { data } = await axios.post('/auth/login', params)
    return data
})

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const { data } = await axios.get('/auth/me')
    return data
})

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const { data } = await axios.post('/auth/register', params)
    return data
})

const initialState = {
    data: null,
    status: 'loading',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        },
    },
    extraReducers: {
        // Tut nado pomeniati code a to vapsha huinia 
        // DRY ( dont repeat yourself )
        [fetchAuth.pending]: (state) => {
            // in Redux Dev Tools
            // if we get a pending request then we are updating the posts status  
            state.status = 'loading'
            state.data = null
        },
        [fetchAuth.fulfilled]: (state, action) => {
            // in Redux Dev Tools
            // if we get a fulfilled request then we are getting the payload and updating the post status
            state.data = action.payload
            state.status = 'laoded'
        },
        [fetchAuth.rejected]: (state) => {
            // in Redux Dev Tools
            // if we get a rejected request then we are setting our payload to an empty massive
            state.data = null;
            state.status = 'error'
        },
        [fetchAuthMe.pending]: (state) => {
            state.status = 'loading'
            state.data = null
        },
        [fetchAuthMe.fulfilled]: (state, action) => {
            state.data = action.payload
            state.status = 'loaded'
        },
        [fetchAuthMe.rejected]: (state) => {
            state.data = null;
            state.status = 'error'
        },
        [fetchRegister.pending]: (state) => {
            state.status = 'loading'
            state.data = null
        },
        [fetchRegister.fulfilled]: (state, action) => {
            state.data = action.payload
            state.status = 'loaded'
        },
        [fetchRegister.rejected]: (state) => {
            state.data = null;
            state.status = 'error'
        },
    }
})

export const selectIsAuth = (state) => Boolean(state.auth.data)

export const authReducer = authSlice.reducer

export const { logout } = authSlice.actions
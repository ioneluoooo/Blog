import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";


export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const { data } = await axios.get('/posts')
    return data;
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
    const { data } = await axios.get('/tags')
    return data;
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
    await axios.delete(`/posts/${id}`)
})

export const fetchComments = createAsyncThunk('posts/fetchComments', async (id) => {
    await axios.get(`/posts/comments`)
})

const initialState = {
    posts: {
        items: [],
        status: 'loading',
    },
    tags: {
        items: [],
        status: 'loading',
    }
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchPosts.pending]: (state) => {
            // in Redux Dev Tools
            // if we get a pending request then we are updating the posts status  
            state.posts.status = 'loading'
        },
        [fetchPosts.fulfilled]: (state, action) => {
            // in Redux Dev Tools
            // if we get a fulfilled request then we are getting the payload and updating the post status
            state.posts.items = action.payload
            state.posts.status = 'loaded'
        },
        [fetchPosts.rejected]: (state) => {
            // in Redux Dev Tools
            // if we get a rejected request then we are setting our payload to an empty massive
            state.posts.item = [];
            state.posts.status = 'error'
        },

        // FOR TAGS 
        [fetchTags.pending]: (state) => {
            state.tags.status = 'loading'
        },
        [fetchTags.fulfilled]: (state, action) => {
            state.tags.items = action.payload
            state.tags.status = 'loaded'
        },
        [fetchTags.rejected]: (state) => {
            state.tags.item = [];
            state.tags.status = 'error'
        },
        
        //FOR COMMENTS
        [fetchComments.pending]: (state) => {
            state.tags.status = 'loading'
        },
        [fetchComments.fulfilled]: (state, action) => {
            state.tags.items = action.payload
            state.tags.status = 'loaded'
        },
        [fetchComments.rejected]: (state) => {
            state.tags.item = [];
            state.tags.status = 'error'
        },

        // Deleting
        [fetchRemovePost.pending]: (state, action) => {
            state.posts.items = state.posts.items.filter((obj)=> obj._id !== action.meta.arg)
        }
    }
})
export const postsReducer = postsSlice.reducer
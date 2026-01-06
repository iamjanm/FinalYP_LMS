import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

import axiosInstance from '../../Helpers/axiosinstance';

const initialState = {
    allUsersCount: 0,
    subscribedCount: 0,
    allUsers: []
};

export const getStatsData = createAsyncThunk("stats/get", async () => {
    try {
        const response = axiosInstance.get("/admin/users");
        console.log("response",response);
        
        
        toast.promise(response, {
            loading: "Getting the stats........",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to load stats"
        })
        return (await response).data;
    } catch (error) {
        if (error?.response?.status === 401) return null;
        toast.error(error?.response?.data?.message)
    }
})

export const getAllUsers = createAsyncThunk("users/getAll", async () => {
    try {
        const response = axiosInstance.get("/admin/users");
        toast.promise(response, {
            loading: "Getting all users........",
            success: (data) => {
                return data?.data?.message
            },
            error: "Failed to load users"
        })
        return (await response).data;
    } catch (error) {
        if (error?.response?.status === 401) return null;
        toast.error(error?.response?.data?.message)
    }
})
const statSlice = createSlice({
    name: "state",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getStatsData.fulfilled, (state, action) => {
            // console.log(<actio></actio>n)
            state.allUsersCount = action?.payload?.allUsersCount;
            state.subscribedCount = action?.payload?.subscribedUsersCount;
        });
        builder.addCase(getAllUsers.fulfilled, (state, action) => {
            state.allUsers = action?.payload?.users;
        });
    }
})
export default statSlice.reducer;
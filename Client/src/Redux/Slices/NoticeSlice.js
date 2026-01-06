import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosinstance";

const initialState = {
  notices: [],
  currentNotice: null,
};

export const getAllNotices = createAsyncThunk("notice/getAll", async () => {
  try {
    const response = axiosInstance.get("/notices");
    toast.promise(response, {
      loading: "Loading notices...",
      success: "Notices loaded",
      error: "Failed to load notices",
    });
    return (await response).data.notices;
  } catch (error) {
    if (error?.response?.status === 401) return [];
    toast.error(error?.response?.data?.message || "Failed to load notices");
    return [];
  }
});

export const getNoticeById = createAsyncThunk("notice/getById", async (id) => {
  try {
    const response = axiosInstance.get(`/notices/${id}`);
    return (await response).data.notice;
  } catch (error) {
    if (error?.response?.status === 401) return null;
    toast.error(error?.response?.data?.message || "Failed to fetch notice");
    return null;
  }
});

export const createNotice = createAsyncThunk("notice/create", async (data) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("createdBy", data.createdBy);
    if (data.image) formData.append("image", data.image);

    const response = axiosInstance.post(`/notices`, formData);
    toast.promise(response, {
      loading: "Creating notice...",
      success: "Notice created",
      error: "Failed to create notice",
    });
    return (await response).data.notice;
  } catch (error) {
    if (error?.response?.status === 401) return null;
    toast.error(error?.response?.data?.message || "Failed to create notice");
    return null;
  }
});

export const updateNotice = createAsyncThunk("notice/update", async ({ id, data }) => {
  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.image) formData.append("image", data.image);

    const response = axiosInstance.put(`/notices/${id}`, formData);
    toast.promise(response, {
      loading: "Updating notice...",
      success: "Notice updated",
      error: "Failed to update notice",
    });
    return (await response).data;
  } catch (error) {
    if (error?.response?.status === 401) return null;
    toast.error(error?.response?.data?.message || "Failed to update notice");
    return null;
  }
});

export const deleteNotice = createAsyncThunk("notice/delete", async (id) => {
  try {
    const response = axiosInstance.delete(`/notices/${id}`);
    toast.promise(response, {
      loading: "Deleting notice...",
      success: "Notice deleted",
      error: "Failed to delete notice",
    });
    return (await response).data;
  } catch (error) {
    if (error?.response?.status === 401) return null;
    toast.error(error?.response?.data?.message || "Failed to delete notice");
    return null;
  }
});

const noticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllNotices.fulfilled, (state, action) => {
        state.notices = action.payload || [];
      })
      .addCase(getNoticeById.fulfilled, (state, action) => {
        state.currentNotice = action.payload;
      })
      .addCase(createNotice.fulfilled, (state, action) => {
        if (action.payload) state.notices = [action.payload, ...state.notices];
      })
      .addCase(updateNotice.fulfilled, (state, action) => {
        // after update we can refresh list or update item locally
      })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        // assume response contains deleted id? We'll trigger refresh in components after success
      });
  },
});

export default noticeSlice.reducer;
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance from '../../Helpers/axiosinstance';

const initialState = {
  quizzes: [],
  currentQuiz: null,
  lastResult: null,
};

export const getAllQuizzes = createAsyncThunk('quiz/getAll', async () => {
  try {
    const res = await axiosInstance.get('/quiz');
    return res.data?.quizzes || [];
  } catch (error) {
    if (error?.response?.status === 401) return [];
    toast.error(error?.response?.data?.message || 'Failed to load quizzes');
    return [];
  }
});

export const getQuizById = createAsyncThunk('quiz/getById', async (id) => {
  try {
    const res = await axiosInstance.get(`/quiz/${id}`);
    return res.data?.quiz || null;
  } catch (error) {
    if (error?.response?.status === 401) return null;
    toast.error(error?.response?.data?.message || 'Failed to fetch quiz');
    return null;
  }
});

export const submitQuiz = createAsyncThunk('quiz/submit', async ({ id, answers }) => {
  try {
    const res = axiosInstance.post(`/quiz/${id}/submit`, { answers });
    toast.promise(res, {
      loading: 'Submitting answers...',
      success: 'Quiz submitted',
      error: 'Failed to submit quiz',
    });
    return (await res).data || null;
  } catch (error) {
    if (error?.response?.status === 401) return null;
    toast.error(error?.response?.data?.message || 'Failed to submit quiz');
    return null;
  }
});

export const createQuiz = createAsyncThunk('quiz/create', async (data) => {
  try {
    const res = axiosInstance.post('/quiz', data);
    toast.promise(res, {
      loading: 'Creating quiz...',
      success: 'Quiz created',
      error: 'Failed to create quiz',
    });
    return (await res).data?.quiz || null;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to create quiz');
    return null;
  }
});

export const updateQuiz = createAsyncThunk('quiz/update', async ({ id, data }) => {
  try {
    const res = axiosInstance.put(`/quiz/${id}`, data);
    toast.promise(res, {
      loading: 'Updating quiz...',
      success: 'Quiz updated',
      error: 'Failed to update quiz',
    });
    return (await res).data?.quiz || null;
  } catch (error) {
    if (error?.response?.status === 401) return null;
    toast.error(error?.response?.data?.message || 'Failed to update quiz');
    return null;
  }
});

export const deleteQuiz = createAsyncThunk('quiz/delete', async (id) => {
  try {
    const res = axiosInstance.delete(`/quiz/${id}`);
    toast.promise(res, {
      loading: 'Deleting quiz...',
      success: 'Quiz deleted',
      error: 'Failed to delete quiz',
    });
    return (await res).data || null;
  } catch (error) {
    if (error?.response?.status === 401) return null;
    toast.error(error?.response?.data?.message || 'Failed to delete quiz');
    return null;
  }
});

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllQuizzes.fulfilled, (state, action) => {
        state.quizzes = action.payload || [];
      })
      .addCase(getQuizById.fulfilled, (state, action) => {
        state.currentQuiz = action.payload;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.lastResult = action.payload;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        if (action.payload) state.quizzes.unshift(action.payload);
      });
  },
});

export default quizSlice.reducer;
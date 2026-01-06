import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance from '../../Helpers/axiosinstance';

const initialState = {
  assessments: [],
  currentAssessment: null,
  submissions: [],
  lastSubmission: null,
};

export const getAllAssessments = createAsyncThunk('assessment/getAll', async () => {
  try {
    const res = await axiosInstance.get('/assessments');
    return res.data?.assessments || [];
  } catch (error) {
    if (error?.response?.status === 401) return [];
    toast.error(error?.response?.data?.message || 'Failed to load assessments');
    return [];
  }
});

export const getAssessmentById = createAsyncThunk('assessment/getById', async (id) => {
  try {
    const res = await axiosInstance.get(`/assessments/${id}`);
    return res.data?.assessment || null;
  } catch (error) {
    if (error?.response?.status === 401) return null;
    toast.error(error?.response?.data?.message || 'Failed to fetch assessment');
    return null;
  }
});

export const createAssessment = createAsyncThunk('assessment/create', async (data) => {
  try {
    const res = axiosInstance.post('/assessments', data);
    toast.promise(res, { loading: 'Creating assessment...', success: 'Assessment created', error: 'Failed to create assessment' });
    return (await res).data.assessment || null;
  } catch (error) {
    if (error?.response?.status === 401) return null;
    toast.error(error?.response?.data?.message || 'Failed to create assessment');
    return null;
  }
});

export const submitAssessment = createAsyncThunk('assessment/submit', async ({ id, submissionText, file }) => {
  try {
    const formData = new FormData();
    if (submissionText) formData.append('submissionText', submissionText);
    if (file) formData.append('file', file);

    const res = axiosInstance.post(`/assessments/${id}/submit`, formData);
    toast.promise(res, { loading: 'Submitting...', success: 'Submitted', error: 'Submission failed' });
    return (await res).data || null;
  } catch (error) {
    if (error?.response?.status === 401) return null;
    toast.error(error?.response?.data?.message || 'Failed to submit assessment');
    return null;
  }
});

export const getSubmissions = createAsyncThunk('assessment/getSubmissions', async (id) => {
  try {
    const res = await axiosInstance.get(`/assessments/${id}/submissions`);
    return res.data?.submissions || [];
  } catch (error) {
    if (error?.response?.status === 401) return [];
    toast.error(error?.response?.data?.message || 'Failed to load submissions');
    return [];
  }
});

export const gradeSubmission = createAsyncThunk('assessment/grade', async ({ id, submissionId, marksAwarded }) => {
  try {
    const res = axiosInstance.post(`/assessments/${id}/grade`, { submissionId, marksAwarded });
    toast.promise(res, { loading: 'Grading...', success: 'Graded', error: 'Failed to grade' });
    return res.data?.submission || null;
  } catch (error) {
    if (error?.response?.status === 401) return null;
    toast.error(error?.response?.data?.message || 'Failed to grade submission');
    return null;
  }
});

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAssessments.fulfilled, (state, action) => {
        state.assessments = action.payload || [];
      })
      .addCase(getAssessmentById.fulfilled, (state, action) => {
        state.currentAssessment = action.payload;
      })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        state.lastSubmission = action.payload;
      })
      .addCase(getSubmissions.fulfilled, (state, action) => {
        state.submissions = action.payload || [];
      })
      .addCase(gradeSubmission.fulfilled, (state, action) => {
        // update submission in list
        if (action.payload) {
          const idx = state.submissions.findIndex((s) => s._id === action.payload._id);
          if (idx !== -1) state.submissions[idx] = action.payload;
        }
      });
  },
});

export default assessmentSlice.reducer;
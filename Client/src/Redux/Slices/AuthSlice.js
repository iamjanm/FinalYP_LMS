import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosinstance"

const isBrowser = typeof window !== "undefined";

const safeParse = (value, fallback) => {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

const initialState = {
    isLoggedIn: isBrowser ? localStorage.getItem("isLoggedIn") === "true" : false,
    role: isBrowser ? localStorage.getItem("role") || "" : "",
    data: isBrowser ? safeParse(localStorage.getItem("data"), {}) : {},
};


export const creatAccount = createAsyncThunk(
    "/auth/signup",
    async (data, { rejectWithValue }) => {
        try {
            // Await the axios request
            const res = await axiosInstance.post("user/register", data);

            // Use toast.promise correctly
            toast.success(res.data.message || "Account created successfully!");

            // Return data for Redux payload
            return res.data;

        } catch (error) {
            // Show toast
            toast.error(error?.response?.data?.message || error.message);

            // Reject with value so payload is set properly in Redux
            return rejectWithValue(error?.response?.data || { message: error.message });
        }
    }
);


export const login = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = axiosInstance.post("user/login", data);
        toast.promise(res, {
            loading: "wait authentication in process..... ",
            success: (data) => {
                return data?.data?.message;
            },
            error: (error) => {
                return error?.response?.data?.message || "Failed to login";
            }
        })
        return (await res).data;

    } catch (error) {
        throw error; // Let the thunk handle the rejection
    }
})

export const adminLogin = createAsyncThunk("/auth/admin-login", async (data) => {
    try {
        const res = axiosInstance.post("/admin/login", data);
        toast.promise(res, {
            loading: "wait admin authentication in process..... ",
            success: (data) => {
                return data?.data?.message;
            },
            error: (error) => {
                return error?.response?.data?.message || "Failed to login as admin";
            }
        })
        return (await res).data;

    } catch (error) {
        throw error;
    }
})

export const logout = createAsyncThunk("/auth/logout", async () => {
    try {
        const res = axiosInstance.post("user/logout");
        toast.promise(res, {
            loading: "wait logout in process..... ",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to logout"
        })
        return (await res).data;

    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})

export const updateProfile = createAsyncThunk("/user/update/profile", async (data) => {
    try {
        const res = axiosInstance.put(`user/update`, data);
        toast.promise(res, {
            loading: "wait profile update in process..... ",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to profile update"
        })
        return (await res).data;

    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})

export const getuserData = createAsyncThunk("/user/details", async () => {
    try {
        const res = axiosInstance.get("user/me");
        return (await res).data;
    } catch (error) {
        toast.error(error?.message)
    }
})

export const forgetPassword = createAsyncThunk("/auth/forget-Password", async (data) => {
    try {
        const res = axiosInstance.post("user/reset", data);
        toast.promise(res, {
            loading: "wait forgetPassword in process..... ",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to forgetPassword"
        })
        return (await res).data;

    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const changePassword = createAsyncThunk(
    "/auth/changePassword",
    async (userPassword) => {
        try {
            let res = axiosInstance.post("/user/change-password", userPassword);
            toast.promise(res, {
                loading: "wait  in process..... ",
                success: (data) => {
                    return data?.data?.message;
                },
                error: "Failed to change Password"
            })
            return (await res).data;
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    });

export const adminChangePassword = createAsyncThunk(
    "/auth/adminChangePassword",
    async (data) => {
        try {
            let res = axiosInstance.post("/user/admin/change-password", data);
            toast.promise(res, {
                loading: "wait changing admin credentials..... ",
                success: (data) => {
                    return data?.data?.message;
                },
                error: "Failed to change admin credentials"
            })
            return (await res).data;
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    });

export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
    try {
        let res = axiosInstance.post(`/user/reset/${data.resetToken}`, { password: data.password });
        toast.promise(res, {
            loading: "wait  in process..... ",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to reset Password"
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(creatAccount.fulfilled, (state, action) => {
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role
                state.isLoggedIn = true;

            })
            .addCase(login.fulfilled, (state, action) => {
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role
                { state.role && (state.isLoggedIn = true) }

            })
            .addCase(adminLogin.fulfilled, (state, action) => {
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role
                { state.role && (state.isLoggedIn = true) }

            })
            .addCase(logout.fulfilled, (state) => {
                localStorage.clear();
                state.data = {};
                state.isLoggedIn = false;
                state.role = "";

            })
            .addCase(getuserData.fulfilled, (state, action) => {
                if (action?.payload?.user) return;
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role

            })

    }
});

// export const {}= authSlice.actions;
export default authSlice.reducer;
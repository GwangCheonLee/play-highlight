import {createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction} from '@reduxjs/toolkit';
import {fetchSignInBody, fetchSignUpBody} from "../../common/types/api/authentication/authenticationTypes";
import {fetchAccessToken, fetchSignIn, fetchSignUp} from "../../common/services/authentication/authenticationService";
import {User} from "../../common/types/jwtTypes";
import {parseJwt} from "../../common/constatns";
import {AxiosError} from "axios";

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: AxiosError | string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    accessToken: window.localStorage.getItem('accessToken'),
    refreshToken: window.localStorage.getItem('refreshToken'),
    status: 'idle',
    error: null,
};

export const signUpAsync = createAsyncThunk(
    'auth/signUp',
    async (data: fetchSignUpBody, {rejectWithValue}) => {
        try {
            return await fetchSignUp(data);
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "An unknown error occurred");
        }
    }
);

export const signInAsync = createAsyncThunk(
    'auth/signIn',
    async (data: fetchSignInBody, {rejectWithValue}) => {
        try {
            return await fetchSignIn(data);
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "An unknown error occurred");
        }
    }
);

export const refreshAccessTokenAsync = createAsyncThunk(
    'auth/refreshAccessToken',
    async (refreshToken: string, {rejectWithValue}) => {
        try {
            return await fetchAccessToken(refreshToken);
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "An unknown error occurred during token refresh.");
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(isPending(signUpAsync, signInAsync, refreshAccessTokenAsync), (state) => {
                state.status = 'loading';
            })
            .addMatcher(isFulfilled(signUpAsync, signInAsync), (state, action: PayloadAction<{
                accessToken: string;
                refreshToken: string
            }>) => {
                const {accessToken, refreshToken} = action.payload;
                const userInfo = parseJwt(accessToken);

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
                state.isAuthenticated = true;
                state.user = userInfo.user;
                state.status = 'succeeded';
            })
            .addMatcher(isFulfilled(refreshAccessTokenAsync), (state, action: PayloadAction<{
                accessToken: string
            }>) => {
                const {accessToken} = action.payload;
                const userInfo = parseJwt(accessToken);

                localStorage.setItem('accessToken', accessToken);

                state.accessToken = accessToken;
                state.isAuthenticated = true;
                state.user = userInfo.user;
                state.status = 'succeeded';
            })
            .addMatcher(isRejected(signUpAsync, signInAsync, refreshAccessTokenAsync), (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'An error occurred';
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});

export const {logout} = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;

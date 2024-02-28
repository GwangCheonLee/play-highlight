import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchFindVideos} from "../../common/services/videos/videosService";
import {videoDetails} from "../../common/types/api/videos/videoTypes";
import {AxiosError} from "axios";

interface VideosState {
    videos: videoDetails[];
    nextCursor: number | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: AxiosError | string | null;
}

const initialState: VideosState = {
    videos: [],
    nextCursor: null,
    status: 'idle',
    error: null,
};

export const fetchVideos = createAsyncThunk(
    'videos/fetchVideos',
    ({cursor, limit}: { cursor: number | null; limit: number }, {rejectWithValue}) => {
        try {
            return fetchFindVideos({cursor, limit});
        } catch (err) {
            return rejectWithValue(err instanceof Error ? err.message : "An unknown error occurred");
        }
    }
);

const videoSlice = createSlice({
    name: 'videos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVideos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.videos = [...state.videos, ...action.payload.videos];
                state.nextCursor = action.payload.nextCursor;
            })
            .addCase(fetchVideos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error as AxiosError;
            });
    },
});


export const {} = videoSlice.actions;

const videoReducer = videoSlice.reducer;
export default videoReducer


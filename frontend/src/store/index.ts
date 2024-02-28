import {configureStore} from '@reduxjs/toolkit';
import modalReducer from "../features/modal/modalSlice";
import videoReducer from "../features/video/videoSlice";
import authReducer from "../features/auth/authSlice";

export const index = configureStore({
    reducer: {
        modal: modalReducer,
        video: videoReducer,
        auth: authReducer
    },
});

export type RootState = ReturnType<typeof index.getState>;
export type AppDispatch = typeof index.dispatch;

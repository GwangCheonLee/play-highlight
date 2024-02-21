import {configureStore} from '@reduxjs/toolkit';
import modalReducer from "../features/modal/modalSlice";

export const index = configureStore({
    reducer: {
        modal: modalReducer,
    },
});

export type RootState = ReturnType<typeof index.getState>;
export type AppDispatch = typeof index.dispatch;

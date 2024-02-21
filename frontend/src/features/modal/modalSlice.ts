import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ModalState {
    isVisible: boolean;
    message: string;
    confirmCallback?: () => void;
}

const initialState: ModalState = {
    isVisible: false,
    message: '',
    confirmCallback: undefined,
};

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        showModal: (state, action: PayloadAction<{ message: string; confirmCallback?: () => void }>) => {
            state.isVisible = true;
            state.message = action.payload.message;
            state.confirmCallback = action.payload.confirmCallback;
        },
        hideModal: (state) => {
            state.isVisible = false;
            state.message = '';
            state.confirmCallback = undefined;
        },
    },
});

export const {showModal, hideModal} = modalSlice.actions;

const modalReducer = modalSlice.reducer;
export default modalReducer


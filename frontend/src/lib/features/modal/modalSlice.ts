import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isVisible: boolean;
  title: string | null;
  message: string | null;
  isConfirmModal: boolean;
  callback?: () => void;
}

const initialState: ModalState = {
  isVisible: false,
  title: null,
  message: null,
  isConfirmModal: false,
  callback: undefined,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal: (
      state,
      action: PayloadAction<{
        title?: string;
        message: string;
        isConfirmModal?: boolean;
        callback?: () => void;
      }>,
    ) => {
      state.isVisible = true;
      state.title = action.payload.title || null;
      state.message = action.payload.message;
      state.isConfirmModal = action.payload.isConfirmModal || false;
      state.callback = action.payload.callback || undefined;
    },
    hideModal: (state) => {
      state.isVisible = initialState.isVisible;
      state.title = initialState.title;
      state.message = initialState.message;
      state.isConfirmModal = initialState.isConfirmModal;
      state.callback = initialState.callback;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;

const modalReducer = modalSlice.reducer;
export default modalReducer;

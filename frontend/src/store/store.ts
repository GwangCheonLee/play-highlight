import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/store/features/auth/authSlice";
import videoSlice from "@/store/features/video/videoSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      video: videoSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

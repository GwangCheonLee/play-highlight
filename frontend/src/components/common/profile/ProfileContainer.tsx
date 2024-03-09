"use client";
import styled from "../profile.module.scss";
import SignInButton from "@/components/common/profile/SignInButton";
import React, { useEffect } from "react";
import Profile from "@/components/common/profile/Profile";
import { useAppDispatch, useAppSelector } from "@/store/selectors";
import { parseJwt } from "@/utils/constants";
import { signIn, signOut } from "@/store/features/auth/authSlice";
import { isAxiosError } from "axios";
import { fetchAccessToken } from "@/services/auth/authService";

export default function ProfileContainer() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");

    const getAccessToken = async () => {
      try {
        const { accessToken } = await fetchAccessToken();
        const { user } = parseJwt(accessToken);
        sessionStorage.setItem("accessToken", accessToken);
        dispatch(signIn({ user: user }));
      } catch (e) {
        if (isAxiosError(e)) {
          if (e.response?.status === 401) {
            dispatch(signOut());
            return;
          }
        }
      }
    };

    if (accessToken) {
      const jwtClaim = parseJwt(accessToken);
      const currentTime = Date.now() / 1000;
      if (jwtClaim.exp > currentTime) {
        dispatch(signIn({ user: jwtClaim.user }));
      } else {
        getAccessToken();
      }
    } else {
      getAccessToken();
    }
  }, [dispatch]);
  return (
    <div className={styled.profile}>
      {isAuthenticated ? <Profile /> : <SignInButton />}
    </div>
  );
}

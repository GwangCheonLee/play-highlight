"use client";
import styles from "@/app/[locale]/setting/setting.module.scss";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/selectors";
import React, { ChangeEvent } from "react";
import { fetchUploadProfileImage } from "@/services/profile/profileService";
import { parseJwt } from "@/utils/constants";
import { signIn } from "@/store/features/auth/authSlice";

export default function ProfileImage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const t = useTranslations("Setting");
  if (!user) return;

  const profileImage = user.profileImage
    ? `/static/profiles/${user.id}/${user.profileImage}`
    : "/assets/images/default_user_profile.png";

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (e.target.files?.length) {
      formData.append("profileImage", e.target.files[0]);
    }

    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) return;

      const { accessToken: responseAccessToken } =
        await fetchUploadProfileImage(formData, accessToken);

      const { user } = parseJwt(responseAccessToken);
      sessionStorage.setItem("accessToken", responseAccessToken);
      dispatch(signIn({ user: user }));
    } catch (error) {
      console.error("File upload failed", error);
    }
  };

  return (
    <div className={styles.settingProfileWrapper}>
      <div>
        <img
          className={styles.settingProfileImage}
          alt="profile"
          src={profileImage}
        />
        <input
          className={styles.settingUploadInput}
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={onChange}
        />
      </div>
      <div className={styles.settingProfileImageButtonWrapper}>
        <button
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          {t("uploadImage")}
        </button>
        <button>{t("deleteImage")}</button>
      </div>
    </div>
  );
}

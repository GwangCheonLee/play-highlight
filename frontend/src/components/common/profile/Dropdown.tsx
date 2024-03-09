import styles from "@/components/common/profile/profile.module.scss";
import { fetchSignOut } from "@/services/auth/authService";
import { isAxiosError } from "axios";
import { useAppDispatch } from "@/store/selectors";
import { signOut } from "@/store/features/auth/authSlice";
import Link from "next/link";
import { settingPath, uploadPath } from "@/utils/routes/constants";
import { useTranslations } from "next-intl";
import React from "react";

export default function Dropdown({ isOpened }: { isOpened: boolean }) {
  const dispatch = useAppDispatch();
  const t = useTranslations("Menu");

  const handleSignOut = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        await fetchSignOut(accessToken);
        sessionStorage.removeItem("accessToken");
        dispatch(signOut());
      }
    } catch (e) {
      if (isAxiosError(e)) {
        return;
      }
    }
  };

  const dropDownDisplay = isOpened ? "block" : "none";
  return (
    <ul
      className={styles.profileContextMenu}
      style={{ display: dropDownDisplay }}
    >
      <Link href={uploadPath}>
        <li>{t("videoUpload")}</li>
      </Link>
      <Link href={settingPath}>
        <li>{t("setting")}</li>
      </Link>
      <li onClick={handleSignOut}>{t("signOut")}</li>
    </ul>
  );
}

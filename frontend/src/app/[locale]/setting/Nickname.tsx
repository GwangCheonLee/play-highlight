"use client";
import { useAppDispatch, useAppSelector } from "@/store/selectors";
import styles from "@/app/[locale]/setting/setting.module.scss";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { fetchChangeNickname } from "@/services/auth/authService";
import { parseJwt } from "@/utils/constants";
import { signIn } from "@/store/features/auth/authSlice";
import { useTranslations } from "next-intl";

export default function Nickname() {
  const dispatch = useAppDispatch();
  const [isActive, setIsActive] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const t = useTranslations("Setting");

  const { register, handleSubmit } = useForm<{ nickname: string }>();

  if (!user) return <></>;

  const onSubmit = async ({ nickname }: { nickname: string }) => {
    handleActive();

    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) return;

    const { accessToken: responseAccessToken } = await fetchChangeNickname(
      accessToken,
      nickname,
    );
    const { user } = parseJwt(responseAccessToken);
    sessionStorage.setItem("accessToken", responseAccessToken);
    dispatch(signIn({ user: user }));
  };

  const handleActive = () => {
    setIsActive((v) => !v);
  };

  return (
    <>
      {isActive ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register("nickname", { value: user.nickname })} />
          <button type="submit" className={styles.settingEditButton}>
            {t("saveText")}
          </button>
        </form>
      ) : (
        <>
          <div className="">{user.nickname}</div>
          <div className="editWrapper">
            <button className={styles.settingEditButton} onClick={handleActive}>
              {t("editText")}
            </button>
          </div>
        </>
      )}
    </>
  );
}

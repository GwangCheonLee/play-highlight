"use client";
import Header from "@/components/common/Header";
import styles from "@/app/[locale]/setting/setting.module.scss";
import React, { useEffect } from "react";
import SettingRaw from "@/app/[locale]/setting/SettingRaw";
import LocaleSwitcher from "@/components/localeSwitcher/LocaleSwitcher";
import Nickname from "@/app/[locale]/setting/Nickname";
import ProfileImage from "@/app/[locale]/setting/ProfileImage";
import { useRouter } from "next/navigation";
import { isValidToken } from "@/utils/constants";
import { rootPath } from "@/utils/routes/constants";

const Setting = () => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const isAuthenticated = accessToken && isValidToken(accessToken);

    if (!isAuthenticated) {
      router.push(rootPath);
    }
  }, [router]);

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.settingWrapper}>
            <ProfileImage />
            <SettingRaw
              title={"nicknameTitle"}
              description={"nicknameDescription"}
            >
              <Nickname />
            </SettingRaw>
            <SettingRaw
              title={"languageTitle"}
              description={"languageDescription"}
            >
              <LocaleSwitcher />
            </SettingRaw>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Setting;

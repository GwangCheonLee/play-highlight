"use client";
import Header from "@/components/common/Header";
import styles from "@/app/[locale]/setting/setting.module.scss";
import React, { useEffect } from "react";
import SettingRaw from "@/app/[locale]/setting/SettingRaw";
import LocaleSwitcher from "@/components/localeSwitcher/LocaleSwitcher";
import Nickname from "@/app/[locale]/setting/Nickname";
import ProfileImage from "@/app/[locale]/setting/ProfileImage";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/selectors";
import { rootPath } from "@/utils/routes/constants";

const Setting = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(rootPath);
    }
  }, [router, isAuthenticated]);

  if (!isAuthenticated) {
    return <></>;
  }

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
              children={<Nickname />}
            />
            <SettingRaw
              title={"languageTitle"}
              description={"languageDescription"}
              children={<LocaleSwitcher />}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Setting;

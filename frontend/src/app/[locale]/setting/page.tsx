import Header from "@/components/common/Header";
import styles from "@/app/[locale]/setting/setting.module.scss";
import React from "react";
import SettingRaw from "@/app/[locale]/setting/SettingRaw";
import LocaleSwitcher from "@/components/localeSwitcher/LocaleSwitcher";
import Nickname from "@/app/[locale]/setting/Nickname";

export default function Setting() {
  return (
    <div>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.settingWrapper}>
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
}

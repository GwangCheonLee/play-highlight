import Header from "@/components/common/Header";
import styles from "@/app/[locale]/setting/setting.module.scss";
import React from "react";
import LocaleSwitcher from "@/components/localeSwitcher/LocaleSwitcher";
import { useTranslations } from "next-intl";

export default function Setting() {
  const t = useTranslations("Setting");
  return (
    <div>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          <div className={styles.settingWrapper}>
            <div className={styles.settingItemContainer}>
              <div className={styles.settingRawWrapper}>
                <div className={styles.settingTitleWrapper}>
                  <h3>{t("languageTitle")}</h3>
                </div>
                <div className={styles.settingContent}>
                  <LocaleSwitcher />
                </div>
              </div>
              <div className={styles.settingDescription}>
                {t("languageDescription")}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

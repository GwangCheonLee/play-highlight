import styles from "@/app/[locale]/setting/setting.module.scss";
import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";

export default function SettingRaw({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const t = useTranslations("Setting");
  return (
    <div className={styles.settingItemContainer}>
      <div className={styles.settingRawWrapper}>
        <div className={styles.settingTitleWrapper}>
          <h3>{t(title)}</h3>
        </div>
        <div className={styles.settingContent}>{children}</div>
      </div>
      <div className={styles.settingDescription}>{t(description)}</div>
    </div>
  );
}

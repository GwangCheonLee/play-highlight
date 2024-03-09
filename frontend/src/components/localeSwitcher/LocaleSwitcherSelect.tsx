"use client";
import styles from "./LocaleSwitcherSelect.module.scss";
import { ChangeEvent, ReactNode, useTransition } from "react";
import { usePathname, useRouter } from "@/navigation";

type Props = {
  children: ReactNode;
  defaultValue: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
}: Props) {
  const router = useRouter();
  const [isPending] = useTransition();
  const pathname = usePathname();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    router.push(pathname, { locale: nextLocale });
  }

  return (
    <div className={styles.localeSwitcher}>
      <label>
        <select
          defaultValue={defaultValue}
          disabled={isPending}
          onChange={onSelectChange}
        >
          {children}
        </select>
      </label>
    </div>
  );
}

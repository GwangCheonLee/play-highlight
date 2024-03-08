"use client";
import styles from "./profile.module.scss";
import Image from "next/image";
import { useState } from "react";
import Dropdown from "@/components/common/profile/Dropdown";

export default function Profile() {
  const [isOpened, setIsOpened] = useState(false);

  const handleDropdownClick = () => {
    setIsOpened((v) => !v);
  };

  return (
    <div className={styles.profileWrapper} onClick={handleDropdownClick}>
      <Image
        className={styles.profileImage}
        src={"/assets/images/default_user_profile.png"}
        alt={"image"}
        width={36}
        height={36}
      />
      <svg
        className={styles.profileArrowDown}
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 24 24"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M7 10l5 5 5-5z"></path>
      </svg>
      <Dropdown isOpened={isOpened} />
    </div>
  );
}

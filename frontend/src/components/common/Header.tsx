import styles from "./header.module.scss";
import Logo from "@/components/common/Logo";
import ProfileContainer from "@/components/common/profile/ProfileContainer";

export default function Header() {
  return (
    <header className={styles.header}>
      <Logo />
      <ProfileContainer />
    </header>
  );
}

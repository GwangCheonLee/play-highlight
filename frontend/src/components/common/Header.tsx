import styles from "./header.module.scss";
import Logo from "@/components/common/Logo";
import Profile from "@/components/common/Profile";

export default function Header() {
  return (
    <header className={styles.header}>
      <Logo />
      <Profile />
    </header>
  );
}

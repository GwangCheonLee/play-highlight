import styles from "./header.module.scss";
import Logo from "@/components/layout/Logo";
import Profile from "@/components/layout/Profile";

export default function Header() {
  return (
    <header className={styles.header}>
      <Logo />
      <Profile />
    </header>
  );
}

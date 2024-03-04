import styles from "@/components/common/profile/profile.module.scss";
import Link from "next/link";

const menus: Record<string, string[]> = {};

export default function Dropdown({ isOpened }: { isOpened: boolean }) {
  const dropDownDisplay = isOpened ? "block" : "none";
  return (
    <ul
      className={styles.profileContextMenu}
      style={{ display: dropDownDisplay }}
    >
      {Object.values(menus).map((menu) => {
        const [menuName, menuPath] = menu;
        return (
          <li>
            <Link href={menuPath}>{menuName}</Link>
          </li>
        );
      })}
    </ul>
  );
}

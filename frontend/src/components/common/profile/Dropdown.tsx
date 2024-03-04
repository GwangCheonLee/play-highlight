import styles from "@/components/common/profile/profile.module.scss";

export default function Dropdown({ isOpened }: { isOpened: boolean }) {
  const dropDownDisplay = isOpened ? "block" : "none";
  return (
    <ul
      className={styles.profileContextMenu}
      style={{ display: dropDownDisplay }}
    >
      {/*<li></li>*/}
    </ul>
  );
}

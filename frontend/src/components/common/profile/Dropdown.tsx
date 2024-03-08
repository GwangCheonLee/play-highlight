import styles from "@/components/common/profile/profile.module.scss";
import { fetchSignOut } from "@/services/auth/authService";
import { isAxiosError } from "axios";
import { useAppDispatch } from "@/store/selectors";
import { signOut } from "@/store/features/auth/authSlice";
import Link from "next/link";
import { uploadPath } from "@/utils/routes/constants";

export default function Dropdown({ isOpened }: { isOpened: boolean }) {
  const dispatch = useAppDispatch();

  const handleSignOut = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        await fetchSignOut(accessToken);
        sessionStorage.removeItem("accessToken");
        dispatch(signOut());
      }
    } catch (e) {
      if (isAxiosError(e)) {
        return;
      }
    }
  };

  const dropDownDisplay = isOpened ? "block" : "none";
  return (
    <ul
      className={styles.profileContextMenu}
      style={{ display: dropDownDisplay }}
    >
      <li>
        <Link href={uploadPath}>비디오 업로드</Link>
      </li>
      <li>설정</li>
      <li onClick={handleSignOut}>로그아웃</li>
    </ul>
  );
}

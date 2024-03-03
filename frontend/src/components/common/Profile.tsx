import styled from "./profile.module.scss";
import Link from "next/link";
import { signInPath } from "@/utils/routes/constants";

export default function Profile() {
  return (
    <div className={styled.profile}>
      <Link className={styled.signInButton} href={signInPath}>
        Sign in
      </Link>
    </div>
  );
}

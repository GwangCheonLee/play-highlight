"use client";
import styled from "@/components/common/profile.module.scss";
import { signInPath } from "@/utils/routes/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignInButton() {
  const path = usePathname();
  return path !== signInPath ? (
    <Link className={styled.signInButton} href={signInPath}>
      Sign in
    </Link>
  ) : (
    <></>
  );
}

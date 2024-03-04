import styled from "../profile.module.scss";
import React from "react";
import SignInButton from "@/components/common/profile/SignInButton";

export default function ProfileContainer() {
  return (
    <div className={styled.profile}>
      <SignInButton />
      {/*<Profile />*/}
    </div>
  );
}

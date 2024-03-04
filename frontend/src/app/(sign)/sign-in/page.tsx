import React from "react";
import styles from "../sign.module.scss";
import { pickYoutubeVideoInformation } from "@/utils/config/youtubeViewer.config";
import YoutubeViewer from "@/components/youtubeViewer/YoutubeViewer";
import SignInForm from "@/app/(sign)/sign-in/SignInForm";
import SignUpLink from "@/app/(sign)/sign-in/SignUpLink";

const SignIn = () => {
  const youtubeVideoInformation = pickYoutubeVideoInformation();
  return (
    <div className={styles.signInWrapper}>
      <div className={styles.signInFormWrapper}>
        <SignInForm />
        <SignUpLink />
      </div>
      <YoutubeViewer
        videoId={youtubeVideoInformation.id}
        startTime={youtubeVideoInformation.startTime}
      />
    </div>
  );
};

export default SignIn;

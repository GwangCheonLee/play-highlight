import styles from "../sign.module.scss";
import { pickYoutubeVideoInformation } from "@/utils/config/youtubeViewer.config";
import YoutubeViewer from "@/components/youtubeViewer/YoutubeViewer";
import SignInForm from "@/app/[locale]/(sign)/sign-in/SignInForm";
import React from "react";
import SignUpLink from "@/app/[locale]/(sign)/sign-in/SignUpLink";

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

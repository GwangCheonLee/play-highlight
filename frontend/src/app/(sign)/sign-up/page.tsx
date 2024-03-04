import { pickYoutubeVideoInformation } from "@/utils/config/youtubeViewer.config";
import styles from "@/app/(sign)/sign.module.scss";
import YoutubeViewer from "@/components/youtubeViewer/YoutubeViewer";
import SignUpForm from "@/app/(sign)/sign-up/SignUpForm";

export default function SignUp() {
  const youtubeVideoInformation = pickYoutubeVideoInformation();
  return (
    <div className={styles.signInWrapper}>
      <div className={styles.signInFormWrapper}>
        <SignUpForm />
      </div>
      <YoutubeViewer
        videoId={youtubeVideoInformation.id}
        startTime={youtubeVideoInformation.startTime}
      />
    </div>
  );
}

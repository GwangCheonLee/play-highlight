import styles from "../sign.module.scss";
import { signUpPath } from "@/utils/routes/constants";
import Link from "next/link";

const SignUpLink = () => {
  return (
    <p className={styles.signUpLinkDescription}>
      Don't have an account?{" "}
      <Link className={styles.signUpHyperLink} href={signUpPath}>
        Sign up
      </Link>
    </p>
  );
};

export default SignUpLink;

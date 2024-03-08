"use client";
import styles from "@/app/[locale]/(sign)/sign.module.scss";
import { useForm } from "react-hook-form";
import Logo from "@/components/common/Logo";
import SignInput from "@/app/[locale]/(sign)/SignInput";
import { SignUpBody } from "@/types/auth/authTypes";
import { useAppDispatch } from "@/store/selectors";
import { parseJwt } from "@/utils/constants";
import { signIn } from "@/store/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { fetchSignUp } from "@/services/auth/authService";
import { extractAxiosErrorDetails } from "@/utils/axiosError";
import { useModal } from "@/contexts/ModalContext";

const SignUpForm = () => {
  const dispatch = useAppDispatch();
  const { showModal } = useModal();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpBody>();

  const onSubmit = async (formData: SignUpBody) => {
    try {
      const { accessToken } = await fetchSignUp(formData);
      const { user } = parseJwt(accessToken);
      sessionStorage.setItem("accessToken", accessToken);
      dispatch(signIn({ user: user }));

      router.push("/");
    } catch (e) {
      const errorDetails = extractAxiosErrorDetails(e);
      showModal(null, errorDetails.errorMessage, false);
    }
  };

  return (
    <form className={styles.signInForm} onSubmit={handleSubmit(onSubmit)}>
      <Logo />
      <SignInput
        register={register}
        validation={{
          required: "Required.",
        }}
        name="nickname"
        type="text"
        placeholder="Enter your nickname"
        title="Nickname"
      />
      <SignInput
        register={register}
        validation={{
          required: "Required.",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
            message: "It's not in the form of an email.",
          },
        }}
        name="email"
        type="text"
        placeholder="Enter your email"
        title="Email"
      />
      {errors.email && (
        <p className={styles.errorText}>{errors?.email?.message}</p>
      )}

      <SignInput
        register={register}
        validation={{ required: "Required." }}
        name="password"
        type="password"
        placeholder="Enter your password"
        title="Password"
      />
      <button className={styles.signUpButton} type="submit">
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;

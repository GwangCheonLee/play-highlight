"use client";
import React from "react";
import styles from "../sign.module.scss";
import { useForm } from "react-hook-form";
import SignInput from "../SignInput";
import RememberMe from "./RememberMe";
import Logo from "@/components/common/Logo";

const SignInForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
    rememberMe: boolean;
  }>();

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <form className={styles.signInForm} onSubmit={handleSubmit(onSubmit)}>
      <Logo />
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
      <RememberMe register={register} name="rememberMe" />
      <button className={styles.signInButton} type="submit">
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;

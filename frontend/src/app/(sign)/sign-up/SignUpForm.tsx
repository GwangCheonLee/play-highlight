"use client";
import React from "react";
import styles from "@/app/(sign)/sign.module.scss";
import { useForm } from "react-hook-form";
import Logo from "@/components/common/Logo";
import SignInput from "@/app/(sign)/SignInput";

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

export default SignInForm;

import React from "react";
import styles from "./sign.module.scss";
import { UseFormRegister } from "react-hook-form";

interface LoginInputProps {
  register: UseFormRegister<any>;
  validation?: object;
  name: string;
  type: string;
  placeholder: string;
  title: string;
}

const SignInput = ({
  register,
  name,
  type,
  placeholder,
  title,
  validation = {},
}: LoginInputProps) => {
  return (
    <>
      <span className={styles.signInputTitle}>{title}</span>
      <input
        className={styles.signInput}
        {...register(name, validation)}
        type={type}
        placeholder={placeholder}
      />
    </>
  );
};

export default SignInput;

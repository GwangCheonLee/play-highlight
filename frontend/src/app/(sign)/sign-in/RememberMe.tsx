import React from "react";
import styles from "../sign.module.scss";
import { UseFormRegister } from "react-hook-form";

interface RememberMeContainerProps {
  register: UseFormRegister<any>;
  validation?: object;
  name: string;
}

const RememberMe = ({ register, name }: RememberMeContainerProps) => {
  return (
    <div className={styles.rememberMeWrapper}>
      <input {...register(name)} id="rememberMeCheckbox" type="checkbox" />
      <label htmlFor="rememberMeCheckbox">Remember me</label>
    </div>
  );
};

export default RememberMe;

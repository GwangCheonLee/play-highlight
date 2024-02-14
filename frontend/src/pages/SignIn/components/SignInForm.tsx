import styled from "styled-components";
import React from "react";
import Logo from "../../../common/components/Logo";
import {useForm} from "react-hook-form";
import LoginInputContainer from "../../../common/components/login/LoginInputContainer";
import RememberMeContainer from "../../../common/components/login/RememberMeContainer";

const LogoStyled = styled(Logo)`
    text-align: center;

    img {
        width: 36px;
        height: 36px;
        margin: 0 10px;
    }

    span {
        font-weight: bold;
        font-size: 24px;
        color: #000000;
    }
`;


const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 20px;
    border-radius: 8px;
`;

const SignInButton = styled.button`
    padding: 13px 10px;
    background-color: #4164e3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        background-color: #0056b3;
    }
`;

type FormValues = {
    email: string;
    password: string;
    rememberMe?: boolean;
}

const SignInForm = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<FormValues>()
    
    const onSubmit = (data: FormValues) => {
        console.log(data)
    }
    
    
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <LogoStyled/>
            <LoginInputContainer
                register={register}
                validation={{
                    required: "필수 응답 항목입니다.",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                        message: "이메일 형식이 아닙니다."
                    }
                }}
                name="email"
                type="text"
                placeholder="Enter your email"
                title="Email"
            />
            <LoginInputContainer
                register={register}
                validation={{required: "필수 응답 항목입니다."}}
                name="password"
                type="password"
                placeholder="Enter your password"
                title="Password"
            />
            <RememberMeContainer register={register} name="rememberMe"/>
            <SignInButton type="submit">Sign In</SignInButton>
        </Form>
    );
};

export default SignInForm;
import styled from "styled-components";
import React, {useState} from "react";
import {SignPageLogo} from "../../../common/components/Logo";
import {useForm} from "react-hook-form";
import SignInInput from "./SignInInput";
import RememberMe from "./RememberMe";
import {useNavigate} from "react-router-dom";
import {fetchSignInBody} from "../../../common/interfaces/api/authentication/authentication.interface";
import {fetchSignIn} from "../../../common/api/authentication/authentication.service";

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

const ErrorText = styled.p`
    margin: 10px 0 0;
    font-size: 12px;
    color: #A50016;
`;


const SignInForm = () => {
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<fetchSignInBody>();
    const onSubmit = async (data: fetchSignInBody) => {
        try {
            await fetchSignIn(data);
            navigate("/");
        } catch (error: any) {
            setErrorMessage(error.response?.data.message);
        }
    };
    
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <SignPageLogo/>
            <SignInInput
                register={register}
                validation={{
                    required: "필수 응답 항목입니다.",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                        message: "이메일 형식이 아닙니다.",
                    },
                }}
                name="email"
                type="text"
                placeholder="Enter your email"
                title="Email"
            />
            <SignInInput
                register={register}
                validation={{required: "필수 응답 항목입니다."}}
                name="password"
                type="password"
                placeholder="Enter your password"
                title="Password"
            />
            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            <RememberMe register={register} name="rememberMe"/>
            <SignInButton type="submit">Sign In</SignInButton>
        </Form>
    );
};

export default SignInForm;

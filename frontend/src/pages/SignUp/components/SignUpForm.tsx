import {useForm} from "react-hook-form";
import styled from "styled-components";
import {SignPageLogo} from "../../../common/components/Logo";
import React, {useState} from "react";
import SignUpInput from "./SignUpInput";
import {useNavigate} from "react-router-dom";
import {fetchSignUpBody} from "../../../common/interfaces/api/authentication/authentication.interface";
import {fetchSignUp} from "../../../common/api/authentication/authentication.service";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 300px;
    padding: 20px;
    border-radius: 8px;
`;

const SignInButton = styled.button`
    margin-top: 20px;
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
    } = useForm<fetchSignUpBody>();
    
    const onSubmit = async (data: fetchSignUpBody) => {
        try {
            await fetchSignUp(data);
            navigate("/");
        } catch (error: any) {
            setErrorMessage(error.response?.data.message);
        }
    };
    
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <SignPageLogo/>
            <SignUpInput
                register={register}
                validation={{
                    required: "필수 응답 항목입니다.",
                }}
                name="nickname"
                type="text"
                placeholder="Enter your nickname"
                title="Nickname"
            />
            <SignUpInput
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
            {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
            <SignUpInput
                register={register}
                validation={{required: "필수 응답 항목입니다."}}
                name="password"
                type="password"
                placeholder="Enter your password"
                title="Password"
            />
            <SignInButton type="submit">Sign Up</SignInButton>
        </Form>
    );
};

export default SignInForm;

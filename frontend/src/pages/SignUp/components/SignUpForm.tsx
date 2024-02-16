import {useForm} from "react-hook-form";
import styled from "styled-components";
import {SignPageLogo} from "../../../common/components/Logo";
import React from "react";
import SignUpInputContainer from "./SignUpInputContainer";
import axios, {AxiosResponse} from "axios";
import {useNavigate} from "react-router-dom";
import {PostSignInterface} from "../../../common/interfaces/sign/sign.interface";


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

type FormValues = {
    email: string;
    password: string;
    rememberMe?: boolean;
}

const SignInForm = () => {
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm<FormValues>()
    
    const onSubmit = async (data: FormValues) => {
        try {
            const apiHost = process.env.REACT_APP_BACKEND_HOST;
            const {
                data: {
                    data: {
                        accessToken,
                        refreshToken
                    }
                }
            }: AxiosResponse<PostSignInterface, any> = await axios.post(`${apiHost}/api/authentication/sign-up`, data);
            
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            
            navigate('/')
        } catch (error: any) {
            console.error('Sign up error:', error.response?.data || error);
        }
    };
    
    
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <span>{process.env.REACT_BACKEND_HOST}</span>
            <SignPageLogo/>
            <SignUpInputContainer
                register={register}
                validation={{
                    required: "필수 응답 항목입니다.",
                }}
                name="nickname"
                type="text"
                placeholder="Enter your nickname"
                title="Nickname"
            />
            <SignUpInputContainer
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
            <SignUpInputContainer
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
import styled from "styled-components";
import React from "react";
import {SignPageLogo} from "../../../common/components/Logo";
import {useForm} from "react-hook-form";
import SignInInputContainer from "./SignInInputContainer";
import RememberMeContainer from "./RememberMeContainer";
import axios, {AxiosResponse} from "axios";
import {PostSignInterface} from "../../../common/interfaces/sign/sign.interface";
import {useNavigate} from "react-router-dom";


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
            }: AxiosResponse<PostSignInterface, any> = await axios.post(`${apiHost}/api/authentication/sign-in`, data);
            
            localStorage.setItem("accessToken", accessToken);
            
            if (data.rememberMe) {
                localStorage.setItem("refreshToken", refreshToken);
            }
            
            navigate('/')
        } catch (error: any) {
            console.error('Sign in error:', error.response?.data || error);
        }
    };
    
    
    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <SignPageLogo/>
            <SignInInputContainer
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
            <SignInInputContainer
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
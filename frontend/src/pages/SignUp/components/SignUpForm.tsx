import {useForm} from "react-hook-form";
import styled from "styled-components";
import {SignPageLogo} from "../../../common/components/Logo";
import React from "react";
import SignUpInput from "./SignUpInput";
import {useNavigate} from "react-router-dom";
import {fetchSignUpBody} from "../../../common/types/api/authentication/authenticationTypes";
import {fetchSignUp} from "../../../common/services/authentication/authenticationService";
import {extractAxiosErrorDetails} from "../../../common/utils/axiosUtils";
import {showModal} from "../../../features/modal/modalSlice";
import {useAppDispatch} from "../../../common/hooks/selectors";

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
    const dispatch = useAppDispatch();
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
            const errorDetails = extractAxiosErrorDetails(error);
            if (errorDetails.statusCode !== null) return
            dispatch(showModal({message: errorDetails.errorMessage}));
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
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            <SignUpInput
                register={register}
                validation={{required: "Required."}}
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

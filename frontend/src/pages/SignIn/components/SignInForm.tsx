import styled from "styled-components";
import React from "react";
import {SignPageLogo} from "../../../common/components/Logo";
import {useForm} from "react-hook-form";
import SignInInput from "./SignInInput";
import RememberMe from "./RememberMe";
import {useNavigate} from "react-router-dom";
import {fetchSignInBody} from "../../../common/types/api/authentication/authenticationTypes";
import {fetchSignIn} from "../../../common/services/authentication/authenticationService";
import {extractAxiosErrorDetails} from "../../../common/utils/axiosUtils";
import {useAppDispatch} from "../../../common/hooks/selectors";
import {showModal} from "../../../features/modal/modalSlice";


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
    const dispatch = useAppDispatch();
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
            const errorDetails = extractAxiosErrorDetails(error);
            if (errorDetails.statusCode !== null) return
            dispatch(showModal({message: errorDetails.errorMessage}));
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <SignPageLogo/>
            <SignInInput
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
            <SignInInput
                register={register}
                validation={{required: "Required."}}
                name="password"
                type="password"
                placeholder="Enter your password"
                title="Password"
            />
            <RememberMe register={register} name="rememberMe"/>
            <SignInButton type="submit">Sign In</SignInButton>
        </Form>
    );
};

export default SignInForm;

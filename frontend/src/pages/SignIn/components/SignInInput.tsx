import React from 'react';
import styled from "styled-components";
import {UseFormRegister} from "react-hook-form";

const Input = styled.input`
    padding: 10px;
    border: 1px solid #dddddd;
    border-radius: 6px;
`;

const Title = styled.span`
    margin-top: 20px;
    font-size: 14px;
    margin-bottom: 10px;
    color: #222222;
`;

interface LoginInputProps {
    register: UseFormRegister<any>;
    validation?: object,
    name: string;
    type: string;
    placeholder: string;
    title: string;
}

const SignInInput = ({register, name, type, placeholder, title, validation = {}}: LoginInputProps) => {
    return (
        <>
            <Title>{title}</Title>
            <Input {...register(name, validation)} type={type} placeholder={placeholder}/>
        </>
    );
}

export default SignInInput;

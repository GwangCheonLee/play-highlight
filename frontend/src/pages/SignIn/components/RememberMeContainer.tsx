import React from 'react';
import styled from 'styled-components';
import {UseFormRegister} from "react-hook-form";

const Container = styled.div`
    display: flex;
    align-items: center;
    margin: 20px 0 10px;
`;

const Label = styled.label`
    margin-left: 5px;
    font-size: 12px;
    user-select: none;
    cursor: pointer;
`;

const Checkbox = styled.input`
    cursor: pointer;
`;

interface RememberMeContainerProps {
    register: UseFormRegister<any>;
    validation?: object;
    name: string;
}


const RememberMeContainer = ({register, name}: RememberMeContainerProps) => {
    
    
    return (
        <Container>
            <Checkbox
                {...register(name)}
                id="rememberMeCheckbox"
                type="checkbox"
            />
            <Label htmlFor="rememberMeCheckbox">Remember me</Label>
        </Container>
    );
}


export default RememberMeContainer;
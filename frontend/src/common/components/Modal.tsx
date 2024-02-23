import React from 'react';
import styled from 'styled-components';
import {useAppDispatch, useAppSelector} from "../hooks/selectors";
import {hideModal} from "../../features/modal/modalSlice";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    width: 20%;
    background-color: white;
    border-radius: 5px;
`;

const ButtonWrapper = styled.div`
    border-top: 1px solid #cccccc;
    display: flex;
    justify-content: flex-end;
    padding: 10px;
`

const CancelButton = styled.button`
    margin-left: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const ConfirmButton = styled(CancelButton)`
    background-color: #4164e3;
    color: #ffffff;
`

const ContentWrapper = styled.div`
    padding: 20px;
`

const Message = styled.p`
    margin: 0;
    font-size: 14px;
    overflow-wrap: break-word;
    word-break: keep-all;
    white-space: pre-wrap;
`;

export const Modal: React.FC = () => {
    const {isVisible, message, confirmCallback} = useAppSelector((state) => state.modal);
    const dispatch = useAppDispatch();

    if (!isVisible) return null;

    return (
        <ModalOverlay>
            <ModalContent>
                <ContentWrapper>
                    <Message>{message}</Message>
                </ContentWrapper>
                <ButtonWrapper>
                    <CancelButton onClick={() => dispatch(hideModal())}>Close</CancelButton>
                    {confirmCallback && (
                        <ConfirmButton onClick={() => {
                            confirmCallback();
                            dispatch(hideModal());
                        }}>Confirm</ConfirmButton>
                    )}
                </ButtonWrapper>
            </ModalContent>
        </ModalOverlay>
    );
};

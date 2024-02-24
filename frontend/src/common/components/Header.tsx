import {Logo} from "./Logo";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {signInPath, uploadPath} from "../routers/path";
import {useAuth} from "../hooks/useAuth";


const StyledHeader = styled.header`
    display: flex;
    justify-content: space-between;
    padding: 10px 15%;
    border-bottom: 1px solid rgba(51, 51, 51, 0.1);
`

const ProfileWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const UploadButton = styled(Link)`
    font-size: 12px;
    line-height: 28px;
    text-decoration: none;
    color: #212529;
    margin-right: 10px;
    cursor: pointer;
    padding: 1px 16px;
    border-radius: 16px;
    background-color: #f8f9fa;
    border: 1px solid #212529;

    &:hover {
        background-color: #212529;
        color: #ffffff
    }
`

const StyledNickname = styled.span`
    font-size: 12px;
    color: #606060;
    line-height: 28px;
`

const SignInButton = styled(Link)`
    font-size: 12px;
    width: auto;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(48, 52, 55, 0.3);
    color: #303437;
    outline: none;
    background-color: #ffffff;
    cursor: pointer;
    transition: transform 0.1s ease, background-color 0.2s ease, box-shadow 0.2s ease;
    text-decoration: none;

    &:active {
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.2);
        transform: scale(0.98);
    }
`
const Header = () => {
    const {isAuthenticated, user} = useAuth();
    return (
        <StyledHeader>
            <Logo isPointerEvent={true}/>
            <ProfileWrapper>
                {
                    (isAuthenticated && user) ?
                        <>
                            <UploadButton to={uploadPath}>Upload</UploadButton>
                            <StyledNickname>{user.nickname}</StyledNickname>
                        </>
                        :
                        <SignInButton to={signInPath}>Sign In</SignInButton>
                }
            </ProfileWrapper>
        </StyledHeader>
    )
}

export default Header
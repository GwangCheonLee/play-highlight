import {Logo} from "./Logo";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {signInPath} from "../routers/path";


const StyledHeader = styled.header`
    display: flex;
    justify-content: space-between;
    padding: 10px calc(15% + 12px + 8px);
    border-bottom: 1px solid rgba(51, 51, 51, 0.1);
`

const SignInButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
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
    return (
        <StyledHeader>
            <Logo isPointerEvent={true}/>
            <SignInButtonWrapper>
                <SignInButton to={signInPath}>Sign In</SignInButton>
            </SignInButtonWrapper>
        </StyledHeader>
    )
}

export default Header
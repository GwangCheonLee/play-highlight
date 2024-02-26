import {createGlobalStyle} from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'Pretendard';
        src: url('../assets/fonts/Pretendard-Bold.otf') format('opentype'),
        url('../assets/fonts/Pretendard-Bold.woff') format('woff');
        font-weight: bold;
        font-style: normal;
    }

    @font-face {
        font-family: 'Pretendard';
        src: url('../assets/fonts/Pretendard-Light.otf') format('opentype'),
        url('../assets/fonts/Pretendard-Light.woff') format('woff');
        font-weight: 300;
        font-style: normal;
    }

    @font-face {
        font-family: 'Pretendard';
        src: url('../assets/fonts/Pretendard-Regular.otf') format('opentype'),
        url('../assets/fonts/Pretendard-Regular.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }

    body {
        font-family: 'Pretendard', sans-serif;
        margin: 0;
    }
`;

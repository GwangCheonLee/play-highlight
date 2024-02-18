export type fetchSignUpBody = {
    nickname: string;
    email: string;
    password: string;
}

export type fetchSignInBody = {
    email: string;
    password: string;
    rememberMe: boolean;
}

export type fetchSignUpResponse = {
    data: {
        accessToken: string;
        refreshToken: string;
    }
}

export type fetchSignInResponse = {
    data: {
        accessToken: string;
        refreshToken: string;
    }
}

export interface fetchSignUpBody {
    nickname: string;
    email: string;
    password: string;
}

export interface fetchSignInBody {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface fetchSignUpResponse {
    data: {
        accessToken: string;
        refreshToken: string;
    }
}

export interface fetchSignInResponse {
    data: {
        accessToken: string;
        refreshToken: string;
    }
}

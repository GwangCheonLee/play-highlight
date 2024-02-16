export interface JwtInterface {
    exp: number;
    iat: number;
    user: User
}


export interface User {
    id: number,
    nickname: string
    email: string
}
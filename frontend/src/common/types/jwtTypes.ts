export type JwtTypes = {
    exp: number;
    iat: number;
    user: User
}


export type User = {
    id: number,
    nickname: string
    email: string
}
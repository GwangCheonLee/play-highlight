export const parseJwt = (token: string | null) => {
    if (token === null) return null
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    } catch (error) {
        return null;
    }
};


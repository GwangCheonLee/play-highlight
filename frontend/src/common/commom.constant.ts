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


export const formatTimeAgo = (createdAt: Date): string => {
    const now = new Date();
    const diffInSeconds = (now.getTime() - createdAt.getTime()) / 1000;
    
    if (diffInSeconds < 60) {
        return "방금 전";
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays}일 전`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInDays < 365) {
        return `${diffInMonths}개월 전`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}년 전`;
};
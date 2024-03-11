import { JwtClaim } from "@/types/jwtClaim";

export const parseJwt = (token: string): JwtClaim => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  const decoder = new TextDecoder("utf-8");
  const jsonStr = decoder.decode(outputArray);

  return JSON.parse(jsonStr);
};

export const isValidToken = (accessToken: string) => {
  try {
    const jwtClaim = parseJwt(accessToken);
    const currentTime = Date.now() / 1000;
    return jwtClaim.exp > currentTime;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

import { JwtClaim } from "@/types/jwtClaim";
import { useTranslations } from "next-intl";

export const parseJwt = (token: string): JwtClaim => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(window.atob(base64));
};

export const formatTimeAgo = (createdAt: Date): string => {
  const t = useTranslations("Video");
  const now = new Date();
  const diffInSeconds = (now.getTime() - createdAt.getTime()) / 1000;

  if (diffInSeconds < 60) {
    return t("justNow");
  }

  console.log(t("justNow"));

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return t("minutesAgo", { count: diffInMinutes });
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return t("hoursAgo", { count: diffInHours });
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return t("daysAgo", { count: diffInDays });
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInDays < 365) {
    return t("monthsAgo", { count: diffInMonths });
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return t("yearsAgo", { count: diffInYears });
};

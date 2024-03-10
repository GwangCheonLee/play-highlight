import createMiddleware from "next-intl/middleware";
import { localePrefix, locales } from "./navigation";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  defaultLocale: "en",
});

export default function middleware(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

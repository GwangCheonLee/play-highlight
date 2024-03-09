import { User } from "@/types/user";

export type JwtClaim = {
  exp: number;
  iat: number;
  user: User;
};

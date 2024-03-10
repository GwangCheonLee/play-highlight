import { USER_ROLE } from "@/types/userRole";

export type User = {
  id: number;
  role: USER_ROLE;
  nickname: string;
  email: string;
  profileImage: string | null;
};

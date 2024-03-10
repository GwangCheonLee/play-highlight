export type SignUpBody = {
  nickname: string;
  email: string;
  password: string;
};

export type SignUpResponse = {
  data: {
    accessToken: string;
  };
};

export type SignInBody = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type SignInResponse = {
  data: {
    accessToken: string;
  };
};

export type ChangeNicknameResponse = {
  data: {
    accessToken: string;
  };
};

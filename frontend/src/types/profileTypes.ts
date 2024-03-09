export type UploadProfileImage = {
  formData: FormData;
  accessToken: string;
};

export type UploadProfileResponse = {
  data: {
    accessToken: string;
  };
};

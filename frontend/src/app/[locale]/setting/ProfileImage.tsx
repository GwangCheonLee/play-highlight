'use client';
import styles from '@/app/[locale]/setting/setting.module.scss';
import {useTranslations} from 'next-intl';
import {useAppDispatch, useAppSelector} from '@/store/selectors';
import React, {ChangeEvent} from 'react';
import {fetchDeleteProfileImage, fetchUploadProfileImage} from '@/services/profile/profileService';
import {parseJwt} from '@/utils/constants';
import {signIn} from '@/store/features/auth/authSlice';
import Image from 'next/image';
import {fetchAccessToken} from '@/services/auth/authService';

export default function ProfileImage() {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector((state) => state.auth);
  const t = useTranslations('Setting');
  if (!user) return;

  const profileImage = user.profileImage
    ? `${process.env.NEXT_PUBLIC_BUCKET}/${user.profileImage}`
    : '/assets/images/default_user_profile.png';

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (e.target.files?.length) {
      formData.append('profileImage', e.target.files[0]);
    }

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) return;

      await fetchUploadProfileImage(formData, accessToken);

      const {accessToken: responseAccessToken} = await fetchAccessToken();

      const {user} = parseJwt(responseAccessToken);
      sessionStorage.setItem('accessToken', responseAccessToken);
      dispatch(signIn({user: user}));
    } catch (error) {
      console.error('File upload failed', error);
    }
  };

  const handleDeleteProfileImage = async () => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) return;

      await fetchDeleteProfileImage(accessToken);

      const {accessToken: responseAccessToken} = await fetchAccessToken();

      const {user} = parseJwt(responseAccessToken);
      sessionStorage.setItem('accessToken', responseAccessToken);
      dispatch(signIn({user: user}));
    } catch (error) {
      console.error('File upload failed', error);
    }
  };

  return (
    <div className={styles.settingProfileWrapper}>
      <div>
        <Image
          className={styles.settingProfileImage}
          alt="profile"
          src={profileImage}
          width={100}
          height={100}
        />
        <input
          className={styles.settingUploadInput}
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={onChange}
        />
      </div>
      <div className={styles.settingProfileImageButtonWrapper}>
        <button
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {t('uploadImage')}
        </button>
        <button onClick={handleDeleteProfileImage}>{t('deleteImage')}</button>
      </div>
    </div>
  );
}

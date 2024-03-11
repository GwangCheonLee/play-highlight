"use client";
import React, { ChangeEvent, DragEvent, useEffect, useState } from "react";
import styles from "./upload.module.scss";
import Header from "@/components/common/Header";
import { fetchUploadVideos } from "@/services/videos/videosService";
import { useModal } from "@/contexts/ModalContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { rootPath } from "@/utils/routes/constants";
import { isValidToken } from "@/utils/constants";

const Upload: React.FC = () => {
  const { showModal } = useModal();
  const t = useTranslations("Upload");
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    const isAuthenticated = accessToken && isValidToken(accessToken);

    if (!isAuthenticated) {
      router.push(rootPath);
    }

    accessToken && setAccessToken(accessToken);
  }, [router]);

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
      } else {
        showModal(null, t("videoFilesOnly"), false);
      }
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("video", selectedFile);

    try {
      if (!accessToken) return;
      await fetchUploadVideos(formData, accessToken);
      showModal(null, t("uploadSuccess"), false, () => {
        router.push(rootPath);
      });
    } catch (error) {
      console.error("File upload failed", error);
      showModal(null, t("uploadFail"), false);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFileInfo = () => {
    if (!selectedFile) {
      return <p>{t("dragDrop")}</p>;
    }

    return (
      <div className={styles.fileDetails}>
        <p>
          {t("fileName")}
          {selectedFile.name}
        </p>
        <p>
          {t("fileSize")}
          {selectedFile.size} bytes
        </p>
        <p>
          {t("fileType")}
          {selectedFile.type}
        </p>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <section className={styles.section}>
          {isLoading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner} />
            </div>
          )}
          <div
            className={styles.uploadWrapper}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            {renderFileInfo()}
            <div className={styles.actionWrapper}>
              <button
                className={styles.button}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {t("selectFile")}
              </button>
              <button className={styles.button} onClick={uploadFile}>
                {t("uploadFile")}
              </button>
              <input
                className={styles.uploadInput}
                id="file-upload"
                type="file"
                accept="video/*"
                onChange={onChange}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Upload;

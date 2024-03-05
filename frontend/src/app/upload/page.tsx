"use client";
import React, { ChangeEvent, DragEvent, useEffect, useState } from "react";
import styles from "./upload.module.scss";
import Header from "@/components/common/Header";
import { fetchUploadVideos } from "@/services/videos/videosService";
import { useModal } from "@/contexts/ModalContext";
import { useRouter } from "next/navigation";

const Upload: React.FC = () => {
  const { showModal } = useModal();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) return;

    setAccessToken(accessToken);
  }, [accessToken]);

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
        showModal(null, "Only video files can be uploaded.", false);
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
      showModal(null, "File upload successful!", false, () => {
        router.push("/");
      });
    } catch (error) {
      console.error("File upload failed", error);
      showModal(null, "File upload failed", false);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFileInfo = () => {
    if (!selectedFile) {
      return (
        <p>Drag and drop a file here or click the button to select a file.</p>
      );
    }

    return (
      <div className={styles.fileDetails}>
        <p>File name: {selectedFile.name}</p>
        <p>File size: {selectedFile.size} bytes</p>
        <p>File type: {selectedFile.type}</p>
      </div>
    );
  };

  return (
    <>
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
                Select File
              </button>
              <button className={styles.button} onClick={uploadFile}>
                Upload
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
    </>
  );
};

export default Upload;

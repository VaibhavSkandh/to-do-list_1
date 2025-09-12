import React, { useRef } from "react";
import styles from "./TaskDetails.module.scss";

interface TaskAttachmentsProps {
  files: { name: string; url: string }[];
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ files, onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLabelClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className={styles.addFileSection}>
        <label htmlFor="file-upload" className={styles.addFileLabel} onClick={handleLabelClick}>
          <span className={`${styles.addFileIcon} material-icons`}>
            attach_file
          </span>
          <span className={styles.addFileText}>Add file</span>
        </label>
        <input
          id="file-upload"
          type="file"
          ref={fileInputRef}
          onChange={onFileChange}
          style={{ display: "none" }}
        />
      </div>

      {files.length > 0 && (
        <div className={styles.uploadedFilesSection}>
          <h3 className={styles.uploadedFilesTitle}>Attached Files</h3>
          <ul className={styles.filesList}>
            {files.map((file, index) => (
              <li key={index} className={styles.fileItem}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.fileLink}
                >
                  <span className={`${styles.fileIcon} material-icons`}>
                    insert_drive_file
                  </span>
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default TaskAttachments;

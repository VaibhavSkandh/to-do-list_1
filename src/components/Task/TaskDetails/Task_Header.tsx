import React from "react";
import styles from "./TaskDetails.module.scss";

interface TaskHeaderProps {
  taskTitle: string;
  favorited: boolean;
  onFavoriteToggle: () => void;
  onClose: () => void;
  onAddStep: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  taskTitle,
  favorited,
  onFavoriteToggle,
  onClose,
  onAddStep,
}) => {
  return (
    <div className={styles.taskHeaderSection}>
      <button onClick={onClose} className={styles.closeButton}>
        <span className="material-icons">close</span>
      </button>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <span className={styles.checkbox}></span>
          <h2 className={styles.taskTitle}>{taskTitle}</h2>
          <button
            className={styles.favoriteButton}
            onClick={onFavoriteToggle}
          >
            <span
              className={`${styles.starIcon} material-icons ${
                favorited ? styles.favorited : ""
              }`}
            >
              star
            </span>
          </button>
        </div>
      </div>
      <div className={styles.addStepSection} onClick={onAddStep}>
        <span className={`${styles.addStepIcon} material-icons`}>add</span>
        <span className={styles.addStepText}>Add step</span>
      </div>
    </div>
  );
};

export default TaskHeader;

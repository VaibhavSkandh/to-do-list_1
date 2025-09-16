import React, { useState, useEffect } from "react";
import styles from "./TaskDetails.module.scss";
import { useAuth } from "../../../hooks/useAuth";
import { useTasks } from "../../../hooks/useTasks";

interface TaskHeaderProps {
  taskId: string;
  onClose: () => void;
  onAddStep: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  taskId,
  onClose,
  onAddStep,
}) => {
  const { user } = useAuth();
  const { tasks, updateTask } = useTasks(user);
  const [taskTitle, setTaskTitle] = useState("");
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    if (tasks.length > 0) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        setTaskTitle(task.text);
        setFavorited(task.favorited);
      }
    }
  }, [tasks, taskId]);

  const handleFavoriteToggle = async () => {
    const newFavoritedState = !favorited;
    setFavorited(newFavoritedState);
    if (user) {
      await updateTask(taskId, { favorited: newFavoritedState });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    if (user && taskTitle.trim() !== "") {
      await updateTask(taskId, { text: taskTitle });
    }
  };

  return (
    <div className={styles.taskHeaderSection}>
      <button onClick={onClose} className={styles.closeButton}>
        <span className="material-icons">close</span>
      </button>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <span className={styles.checkbox}></span>
          <input
            type="text"
            className={styles.taskTitle}
            value={taskTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
          />
          <button
            className={styles.favoriteButton}
            onClick={handleFavoriteToggle}
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
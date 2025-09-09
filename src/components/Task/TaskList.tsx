import React from "react";
import styles from "../../pages/MyDayPage.module.scss";
import { useAuth } from "../../hooks/useAuth";
import { useTasks } from "../../hooks/useTasks";
import { Task } from "../../App";

interface TaskListProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
  pageName: string;
  onUpdateTask?: (taskId: string, update: Partial<Task>) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskSelect,
  pageName,
  onUpdateTask,
}) => {
  const { user } = useAuth();
  const { loading, updateTask } = useTasks(user);

  if (loading) {
    return <div className={styles.loading}>Loading tasks...</div>;
  }

  return (
    <div className={styles.taskList}>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            className={styles.taskItem}
            onClick={() => onTaskSelect(task)}
          >
            <div
              className={`${styles.circleCheckbox} ${
                task.completed ? styles.completed : ""
              }`}
            >
              {task.completed && (
                <span className={`${styles.checkIcon} material-icons`}>
                  check
                </span>
              )}
            </div>
            <span
              className={`${styles.taskText} ${
                task.completed ? styles.completed : ""
              }`}
            >
              {task.text}
            </span>
            <button
              className={styles.favoriteButton}
              onClick={(e) => {
                e.stopPropagation();
                if (onUpdateTask) {
                  onUpdateTask(task.id, { favorited: !task.favorited });
                } else {
                  updateTask(task.id, { favorited: !task.favorited });
                }
              }}
            >
              <span
                className={`${styles.starIcon} material-icons ${
                  task.favorited ? styles.favorited : ""
                }`}
              >
                star
              </span>
            </button>
          </div>
        ))
      ) : (
        <div className={styles.focusCard}>
          <span className={styles.focusCardIcon}>
            {pageName === "My Day"
              ? "☀️"
              : pageName === "Important"
              ? "⭐"
              : "📋"}
          </span>
          <h2 className={styles.focusCardTitle}>You're all caught up!</h2>
          <p className={styles.focusCardText}>Add some tasks to get started.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;

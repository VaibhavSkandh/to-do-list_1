import React from "react";
import styles from "./TaskDetails.module.scss";

interface TaskActionItemProps {
  icon: string;
  label: string;
  value?: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onClear?: () => void;
  children: React.ReactNode;
}

const TaskActionItem: React.FC<TaskActionItemProps> = ({
  icon,
  label,
  value,
  isOpen,
  onToggle,
  onClear,
  children,
}) => {
  return (
    <div
      className={`${styles.actionItem} ${isOpen ? styles.active : ""}`}
    >
      <div className={styles.actionItemHeader} onClick={onToggle}>
        <span className={`${styles.actionIcon} material-icons`}>{icon}</span>
        <span className={styles.actionText}>
          {value ? `${label}: ${value}` : label}
        </span>
        {value && onClear && (
          <button className={styles.clearDateButton} onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}>
            <span className="material-icons">close</span>
          </button>
        )}
      </div>
      {isOpen && children}
    </div>
  );
};

export default TaskActionItem;

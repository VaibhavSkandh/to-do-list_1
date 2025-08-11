import React from 'react';
import styles from './TaskDetails.module.scss';

interface TaskDetailsProps {
  onClose: () => void;
  taskTitle: string;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ onClose, taskTitle }) => {
  return (
    <aside className={styles.taskDetailsPanel}>
      <button onClick={onClose} className={styles.closeButton}>
        <span className="material-icons">close</span>
      </button>
      <div className={styles.taskHeaderSection}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <span className={styles.checkbox}></span>
            <h2 className={styles.taskTitle}>{taskTitle}</h2>
            <span className={`${styles.starIcon} material-icons`}>star_border</span>
          </div>
        </div>
        <div className={styles.addStepSection}>
          <span className={`${styles.addStepIcon} material-icons`}>add</span>
          <span className={styles.addStepText}>Add step</span>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.myDaySection}>
          <span className={`${styles.myDayIcon} material-icons`}>wb_sunny</span>
          <span className={styles.myDayText}>Added to My Day</span>
        </div>
        <div className={styles.actionSection}>
          <div className={styles.actionItem}>
            <span className={`${styles.actionIcon} material-icons`}>schedule</span>
            <span className={styles.actionText}>Remind me</span>
          </div>
          <div className={styles.actionItem}>
            <span className={`${styles.actionIcon} material-icons`}>calendar_today</span>
            <span className={styles.actionText}>Add due date</span>
          </div>
          <div className={styles.actionItem}>
            <span className={`${styles.actionIcon} material-icons`}>repeat</span>
            <span className={styles.actionText}>Repeat</span>
          </div>
        </div>
        <div className={styles.addFileSection}>
          <span className={`${styles.addFileIcon} material-icons`}>attach_file</span>
          <span className={styles.addFileText}>Add file</span>
        </div>
        <div className={styles.noteSection}>
          <textarea className={styles.noteInput} placeholder="Add note"></textarea>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.creationTime}>Created 21 minutes ago</div>
        <span className={`${styles.deleteIcon} material-icons`}>delete</span>
      </div>
    </aside>
  );
};

export default TaskDetails;
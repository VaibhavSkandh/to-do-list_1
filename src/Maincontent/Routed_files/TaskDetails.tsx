import React from 'react';
import styles from './TaskDetails.module.scss';

interface TaskDetailsProps {
  onClose: () => void;
  taskTitle: string;
}

interface ImportantPageProps {
  onTaskSelect: (task: { id: string; title: string }) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ onClose, taskTitle }) => {
  return (
    <aside className={styles.taskDetailsPanel}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <span className={styles.checkbox}></span>
          <h2 className={styles.taskTitle}>{taskTitle}</h2>
          <span className={`${styles.starIcon} material-icons`}>star_border</span>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          <span className="material-icons">close</span>
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.section}>
          <span className={`${styles.addStepIcon} material-icons`}>add</span>
          <span className={styles.addStepText}>Add step</span>
        </div>
        <div className={styles.section}>
          <span className={`${styles.icon} material-icons`}>wb_sunny</span>
          <span className={styles.sectionText}>Added to My Day</span>
          <span className={`${styles.closeIcon} material-icons`}>close</span>
        </div>
        <div className={styles.section}>
          <span className={`${styles.icon} material-icons`}>schedule</span>
          <span className={styles.sectionText}>Remind me</span>
        </div>
        <div className={styles.section}>
          <span className={`${styles.icon} material-icons`}>calendar_today</span>
          <span className={styles.sectionText}>Add due date</span>
        </div>
        <div className={styles.section}>
          <span className={`${styles.icon} material-icons`}>repeat</span>
          <span className={styles.sectionText}>Repeat</span>
        </div>
        <div className={styles.section}>
          <span className={`${styles.icon} material-icons`}>attach_file</span>
          <span className={styles.sectionText}>Add file</span>
        </div>
        <div className={styles.noteSection}>
          <textarea className={styles.noteInput} placeholder="Add note"></textarea>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.creationTime}>Created a few moments ago</div>
      </div>
    </aside>
  );
};

export default TaskDetails;
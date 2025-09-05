import React, { useState } from 'react';
import styles from './MyDayPage.module.scss';

interface TaskBarProps {
  newTaskText: string;
  setNewTaskText: (text: string) => void;
  handleAddTask: () => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TaskBar: React.FC<TaskBarProps> = ({ newTaskText, setNewTaskText, handleAddTask, handleKeyPress }) => {
  const [showIcons, setShowIcons] = useState(false);

  return (
    <div className={styles.taskbar}>
      <button className={styles.addButton} onClick={handleAddTask}>
        <span className="material-icons">add</span>
      </button>
      <input
        type="text"
        className={styles.taskInput}
        placeholder="Add a task"
        value={newTaskText}
        onChange={(e) => {
          setNewTaskText(e.target.value);
          setShowIcons(e.target.value.trim().length > 0);
        }}
        onKeyPress={handleKeyPress}
      />
      {showIcons && (
        <div className={styles.iconGroup}>
          <button className={styles.iconButton}>
            <span className="material-icons">wb_sunny</span>
          </button>
          <button className={styles.iconButton}>
            <span className="material-icons">event</span>
          </button>
          <button className={styles.iconButton}>
            <span className="material-icons">label</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskBar;
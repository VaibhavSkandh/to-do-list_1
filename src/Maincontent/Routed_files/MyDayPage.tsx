// src/Maincontent/Routed_files/MyDayPage.tsx
import React, { useState } from 'react';
import styles from './MyDayPage.module.scss';
import { useAuth } from './useAuth';
import { useTasks } from './useTasks';
import TaskDetails from './TaskDetails';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  favorited: boolean;
}

interface MyDayPageProps {
  onTaskSelect: (task: Task) => void;
  currentBackground: string;
  handleThemeChange: (theme: string) => void;
}

const MyDayPage: React.FC<MyDayPageProps> = ({ currentBackground, handleThemeChange }) => {
  const { user } = useAuth();
  const { tasks, loading, addTask, deleteTask, updateTask } = useTasks(user);
  const [newTaskText, setNewTaskText] = useState('');
  const [showThemesPanel, setShowThemesPanel] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const themes = [
    // Colors
    '#2d2d3e', '#7c2d2d', '#2d7c4f', '#2d4f7c', '#7c2d7c', '#7c7c2d',
    '#2d7c7c', '#7c4f2d', '#4f2d7c', '#4f2d2d', '#7c2d4f', '#4f2d2d',
    // Image URLs (placeholders)
    'https://placehold.co/600x400/2d7c2d/FFFFFF?text=Forest',
    'https://placehold.co/600x400/2d4f7c/FFFFFF?text=Waves',
    'https://placehold.co/600x400/7c2d7c/FFFFFF?text=Space',
    'https://placehold.co/600x400/7c7c2d/FFFFFF?text=Desert',
  ];

  const handleAddTask = () => {
    if (newTaskText.trim() !== '') {
      addTask(newTaskText);
      setNewTaskText('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };
  
  const handleCloseTaskDetails = () => {
    setSelectedTask(null);
  };

  const handleFavoriteToggle = () => {
    if (selectedTask) {
      updateTask(selectedTask.id, { favorited: !selectedTask.favorited });
      setSelectedTask(prevTask => prevTask ? { ...prevTask, favorited: !prevTask.favorited } : null);
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    if (selectedTask?.id === id) {
      handleCloseTaskDetails();
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading tasks...</div>;
  }

  return (
    <div className={styles.myDayLayout}>
      <div className={styles.myDayContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>My Day</h1>
            <div className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.headerIcon}>
              <span role="img" aria-label="sort-by-icon" className="material-icons">sort</span>
            </button>
            <button
              className={styles.headerIcon}
              onClick={() => setShowThemesPanel(!showThemesPanel)}
            >
              <span role="img" aria-label="themes-icon" className="material-icons">palette</span>
            </button>
          </div>
        </div>

        {showThemesPanel && (
          <div className={styles.themesPanel}>
            <h3 className={styles.themesHeader}>Theme</h3>
            <div className={styles.themesGrid}>
              {themes.map((theme, index) => (
                <div
                  key={index}
                  className={`${styles.themeOption} ${currentBackground === theme ? styles.selected : ''} ${theme.startsWith('#') ? '' : styles.themeOptionImage}`}
                  style={
                    theme.startsWith('#')
                      ? { backgroundColor: theme }
                      : { backgroundImage: `url(${theme})` }
                  }
                  onClick={() => handleThemeChange(theme)}
                />
              ))}
            </div>
          </div>
        )}

        <div className={styles.taskList}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className={styles.taskItem}
                onClick={() => handleTaskSelect(task)}
              >
                <div className={`${styles.circleCheckbox} ${task.completed ? styles.completed : ''}`}>
                  {task.completed && <span className={`${styles.checkIcon} material-icons`}>check</span>}
                </div>
                <span className={`${styles.taskText} ${task.completed ? styles.completed : ''}`}>
                  {task.text}
                </span>
                <button
                  className={styles.favoriteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTask(task.id, { favorited: !task.favorited });
                  }}
                >
                  <span className={`${styles.starIcon} material-icons ${task.favorited ? styles.favorited : ''}`}>
                    star
                  </span>
                </button>
              </div>
            ))
          ) : (
            <div className={styles.focusCard}>
              <span className={styles.focusCardIcon}>☀️</span>
              <h2 className={styles.focusCardTitle}>You're all caught up!</h2>
              <p className={styles.focusCardText}>Add some tasks to get started.</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.taskbar}>
        <button className={styles.addButton} onClick={handleAddTask}>
          <span className="material-icons">add</span>
        </button>
        <input
          type="text"
          className={styles.taskInput}
          placeholder="Add a task"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
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
      </div>
      {selectedTask && (
        <TaskDetails
          taskTitle={selectedTask.text}
          taskId={selectedTask.id}
          onClose={handleCloseTaskDetails}
          onDelete={handleDeleteTask}
          favorited={selectedTask.favorited}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
    </div>
  );
};

export default MyDayPage;
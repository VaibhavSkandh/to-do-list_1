// src/Maincontent/Routed_files/MyDayPage.tsx
import React, { useState, useMemo } from 'react';
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
  dueDate?: Date;
}

interface MyDayPageProps {
  onTaskSelect: (task: Task) => void;
  currentBackground: string;
  handleThemeChange: (theme: string) => void;
  isMinimized: boolean;
  handleToggleMinimize: () => void;
}

const MyDayPage: React.FC<MyDayPageProps> = ({ currentBackground, handleThemeChange, isMinimized, handleToggleMinimize }) => {
  const { user } = useAuth();
  const { tasks, loading, addTask, deleteTask, updateTask } = useTasks(user);
  const [newTaskText, setNewTaskText] = useState('');
  const [showMorePanel, setShowMorePanel] = useState(false);
  const [showThemesPanel, setShowThemesPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<'importance' | 'dueDate' | 'alphabetically' | 'creationDate'>('creationDate');

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

  const getSortedTasks = useMemo(() => {
    let sortedTasks = [...tasks];
    switch (sortBy) {
      case 'importance':
        sortedTasks.sort((a, b) => (b.favorited ? 1 : 0) - (a.favorited ? 1 : 0));
        break;
      case 'dueDate':
        sortedTasks.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        });
        break;
      case 'alphabetically':
        sortedTasks.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'creationDate':
      default:
        sortedTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }
    return sortedTasks;
  }, [tasks, sortBy]);

  if (loading) {
    return <div className={styles.loading}>Loading tasks...</div>;
  }

  return (
    <div className={`${styles.myDayLayout} ${isMinimized ? styles.minimized : ''}`} style={currentBackground.startsWith('#') ? { backgroundColor: currentBackground } : { backgroundImage: `url(${currentBackground})`, backgroundSize: 'cover' }}>
      <div className={styles.myDayContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>My Day</h1>
            <div className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.headerIcon} onClick={handleToggleMinimize}>
              <span role="img" aria-label="fullscreen-zoom-icon" className="material-icons">{isMinimized ? 'fullscreen' : 'fullscreen_exit'}</span>
            </button>
            <button className={styles.headerIcon} onClick={() => console.log('Lightbulb clicked')}>
              <span role="img" aria-label="lightbulb-icon" className="material-icons">lightbulb_outline</span>
            </button>
            <button className={styles.headerIcon} onClick={() => setShowMorePanel(!showMorePanel)}>
              <span role="img" aria-label="more-options-icon" className="material-icons">more_horiz</span>
            </button>
            {showMorePanel && (
              <div className={styles.moreOptionsPanel}>
                <div className={styles.moreOption} onClick={() => setShowSortPanel(!showSortPanel)}>
                  <span className={`${styles.moreIcon} material-icons`}>sort</span> Sort by
                </div>
                {showSortPanel && (
                  <div className={styles.nestedPanel}>
                    <div className={styles.sortOption} onClick={() => { setSortBy('importance'); setShowSortPanel(false); }}>Importance</div>
                    <div className={styles.sortOption} onClick={() => { setSortBy('dueDate'); setShowSortPanel(false); }}>Due date</div>
                    <div className={styles.sortOption} onClick={() => { setSortBy('alphabetically'); setShowSortPanel(false); }}>Alphabetically</div>
                    <div className={styles.sortOption} onClick={() => { setSortBy('creationDate'); setShowSortPanel(false); }}>Creation date</div>
                  </div>
                )}
                <div className={styles.moreOption} onClick={() => setShowThemesPanel(!showThemesPanel)}>
                  <span className={`${styles.moreIcon} material-icons`}>palette</span> Theme
                </div>
                {showThemesPanel && (
                  <div className={styles.nestedPanel}>
                    {themes.map((theme, index) => (
                      <div key={index} className={styles.themeOption} onClick={() => handleThemeChange(theme)}>
                        <div className={styles.themeCircle} style={theme.startsWith('#') ? { backgroundColor: theme } : { backgroundImage: `url(${theme})` }}></div>
                      </div>
                    ))}
                  </div>
                )}
                <div className={styles.moreOption} onClick={() => console.log('Hide completed tasks clicked')}>
                  <span className={`${styles.moreIcon} material-icons`}>check_box_outline_blank</span> Hide completed tasks
                </div>
                <div className={styles.moreOption} onClick={() => console.log('Print list clicked')}>
                  <span className={`${styles.moreIcon} material-icons`}>print</span> Print list
                </div>
                <div className={styles.moreOption} onClick={() => console.log('Email list clicked')}>
                  <span className={`${styles.moreIcon} material-icons`}>mail_outline</span> Email list
                </div>
                <div className={styles.moreOption} onClick={() => console.log('Pin to start clicked')}>
                  <span className={`${styles.moreIcon} material-icons`}>push_pin</span> Pin to start
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.taskList}>
          {getSortedTasks.length > 0 ? (
            getSortedTasks.map((task) => (
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
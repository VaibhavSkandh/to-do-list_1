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
  handleToggleSidebar: () => void;
}

const MyDayPage: React.FC<MyDayPageProps> = ({ currentBackground, handleThemeChange, isMinimized, handleToggleMinimize, handleToggleSidebar }) => {
  const { user } = useAuth();
  const { tasks, loading, addTask, deleteTask, updateTask } = useTasks(user);
  const [newTaskText, setNewTaskText] = useState('');
  const [showMorePanel, setShowMorePanel] = useState(false);
  const [showThemesPanel, setShowThemesPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<'importance' | 'dueDate' | 'alphabetically' | 'creationDate'>('creationDate');
  const [currentThemeColor, setCurrentThemeColor] = useState('white');
  const [showIcons, setShowIcons] = useState(false);

  // A list of theme colors to choose from
  const themeColors = [
    '#FFFFFF', // White
    '#FFC0CB', // Pink
    '#87CEEB', // Sky Blue
    '#ADFF2F', // Green Yellow
    '#FFA07A', // Light Salmon
    '#9370DB', // Medium Purple
    '#FFD700', // Gold
  ];

  // A list of background image URLs to choose from
  const themeBackgrounds = [
    'https://placehold.co/1920x1080/0000FF/FFFFFF/png?text=Blue+Sky',
    'https://placehold.co/1920x1080/FF0000/FFFFFF/png?text=Red+Sunset',
    'https://placehold.co/1920x1080/008000/FFFFFF/png?text=Green+Forest',
    'https://placehold.co/1920x1080/800080/FFFFFF/png?text=Purple+Mountains',
    'https://placehold.co/1920x1080/333333/FFFFFF/png?text=Dark+Abstract',
  ];

  const handleAddTask = () => {
    if (newTaskText.trim() !== '') {
      addTask(newTaskText);
      setNewTaskText('');
      setShowIcons(false);
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

  const handleColorThemeChange = (color: string) => {
    setCurrentThemeColor(color);
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
    <div
      className={`${styles.myDayLayout} ${isMinimized ? styles.minimized : ''}`}
      style={{
        backgroundImage: `url(${currentBackground})`,
        backgroundSize: 'cover',
        '--font-color': currentThemeColor,
      } as React.CSSProperties}>
      <div className={styles.myDayContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {isMinimized && (
              <button className={styles.headerIcon} onClick={handleToggleSidebar}>
                <span className="material-icons">menu</span>
              </button>
            )}
            <h1 className={styles.pageTitle}>My Day</h1>
            <div className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.headerIcon} onClick={handleToggleMinimize}>
              <span role="img" aria-label="fullscreen-zoom-icon" className="material-icons">{isMinimized ? 'fullscreen' : 'fullscreen_exit'}</span>
            </button>
            {!isMinimized && (
              <>
                <button className={styles.headerIcon} onClick={() => console.log('Lightbulb clicked')}>
                  <span role="img" aria-label="lightbulb-icon" className="material-icons">lightbulb_outline</span>
                </button>
                <button className={styles.headerIcon} onClick={() => setShowMorePanel(!showMorePanel)}>
                  <span role="img" aria-label="more-options-icon" className="material-icons">more_horiz</span>
                </button>
              </>
            )}
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
                    <div style={{ padding: '0.5rem 1rem' }}>Colors</div>
                    {themeColors.map((color, index) => (
                      <div key={index} className={styles.themeOption} onClick={() => handleColorThemeChange(color)}>
                        <div className={styles.themeCircle} style={{ backgroundColor: color }}></div>
                      </div>
                    ))}
                    <div style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}>Backgrounds</div>
                    {themeBackgrounds.map((background, index) => (
                      <div key={index} className={styles.themeOption} onClick={() => handleThemeChange(background)}>
                        <div className={styles.themeCircle} style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }}></div>
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
      {selectedTask && (
        <TaskDetails
      taskTitle={selectedTask.text}
      taskId={selectedTask.id}
      onClose={handleCloseTaskDetails}
      onDelete={handleDeleteTask}
      favorited={selectedTask.favorited}
      onFavoriteToggle={handleFavoriteToggle}
      creationTime={selectedTask.createdAt}
    />
      )}
    </div>
  );
};

export default MyDayPage;

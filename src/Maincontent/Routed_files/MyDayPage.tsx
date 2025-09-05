import React, { useState, useMemo } from 'react';
import styles from './MyDayPage.module.scss';
import { useAuth } from './useAuth';
import { useTasks } from './useTasks';
import TaskDetails from './TaskDetails';
import PageLayout from './PageLayout';
import PageHeader from './PageHeader';
import TaskList from './TaskList';
import TaskBar from './TaskBar';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  favorited: boolean;
  dueDate?: Date;
}

interface PageHeaderProps {
  pageTitle: string;
  isMinimized: boolean;
  handleToggleMinimize: () => void;
  handleToggleSidebar: () => void;
  setSortBy?: React.Dispatch<React.SetStateAction<'importance' | 'dueDate' | 'alphabetically' | 'creationDate'>>;
  handleThemeChange: (theme: { backgroundColor?: string; backgroundImage?: string }) => void;
}

interface MyDayPageProps {
  onTaskSelect: (task: Task) => void;
  tasks: Task[]; // Added tasks prop
  isMinimized: boolean;
  handleToggleMinimize: () => void;
  handleToggleSidebar: () => void;
  handleThemeChange: (theme: { backgroundColor?: string; backgroundImage?: string }) => void;
  currentBackground: string;
  fontColor: string;
}

const MyDayPage: React.FC<MyDayPageProps> = ({ onTaskSelect, tasks, isMinimized, handleToggleMinimize, handleToggleSidebar, handleThemeChange, currentBackground }) => {
  const { user } = useAuth();
  const { addTask, deleteTask, updateTask } = useTasks(user);
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<'importance' | 'dueDate' | 'alphabetically' | 'creationDate'>('creationDate');

  const getSortedTasks = useMemo(() => {
    let sortedTasks = [...tasks];
    switch (sortBy) {
      case 'importance':
        sortedTasks.sort((a, b) => (b.favorited ? 1 : -1) - (a.favorited ? 1 : -1));
        break;
      case 'dueDate':
        sortedTasks.sort((a, b) => {
          if (a.dueDate && b.dueDate) {
            return a.dueDate.getTime() - b.dueDate.getTime();
          }
          return a.dueDate ? -1 : 1;
        });
        break;
      case 'alphabetically':
        sortedTasks.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'creationDate':
      default:
        sortedTasks.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
    }
    return sortedTasks;
  }, [tasks, sortBy]);

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

  return (
    <PageLayout isMinimized={isMinimized}>
      <PageHeader
        pageTitle="My Day"
        isMinimized={isMinimized}
        handleToggleMinimize={handleToggleMinimize}
        handleToggleSidebar={handleToggleSidebar}
        setSortBy={setSortBy}
        handleThemeChange={handleThemeChange}
      />
      <TaskList
        tasks={getSortedTasks}
        onTaskSelect={handleTaskSelect}
        pageName="My Day"
        onUpdateTask={updateTask}
      />
      <TaskBar
        newTaskText={newTaskText}
        setNewTaskText={setNewTaskText}
        handleAddTask={handleAddTask}
        handleKeyPress={handleKeyPress}
      />
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
    </PageLayout>
  );
};

export default MyDayPage;


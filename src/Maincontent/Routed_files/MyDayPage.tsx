import React, { useState, useMemo } from 'react';
import styles from './MyDayPage.module.scss';
import { useAuth } from './useAuth';
import { useTasks } from './useTasks';
import TaskDetails from './TaskDetails';
import PageLayout from './PageLayout';
import PageHeader from './PageHeader';
import TaskList from './TaskList';
import TaskBar from './TaskBar';
import { Task } from '../../App';

interface MyDayPageProps {
  onTaskSelect: (task: Task) => void;
  tasks: Task[];
  onUpdateTask: (id: string, updatedFields: Partial<Task>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  isMinimized: boolean;
  handleToggleMinimize: () => void;
  handleToggleSidebar: () => void;
  handleThemeChange: (theme: { backgroundColor?: string; backgroundImage?: string }) => void;
}

const MyDayPage: React.FC<MyDayPageProps> = ({ onTaskSelect, tasks, onUpdateTask, onDeleteTask, isMinimized, handleToggleMinimize, handleToggleSidebar, handleThemeChange }) => {
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
            const dateA = a.dueDate instanceof Date ? a.dueDate.getTime() : new Date(a.dueDate).getTime();
            const dateB = b.dueDate instanceof Date ? b.dueDate.getTime() : new Date(b.dueDate).getTime();
            return dateA - dateB;
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
      onUpdateTask(selectedTask.id, { favorited: !selectedTask.favorited });
      setSelectedTask((prevTask: Task | null) => prevTask ? { ...prevTask, favorited: !prevTask.favorited } : null);
    }
  };

  const handleDeleteTask = (id: string) => {
    onDeleteTask(id);
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
        onUpdateTask={onUpdateTask}
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
          onUpdateTask={onUpdateTask}
          favorited={selectedTask.favorited}
          onFavoriteToggle={handleFavoriteToggle}
          creationTime={selectedTask.createdAt}
        />
      )}
    </PageLayout>
  );
};

export default MyDayPage;
import React, { useState } from 'react';
import PageLayout from './PageLayout';
import PageHeader from './PageHeader';
import TaskList from './TaskList';
import TaskBar from './TaskBar';
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

interface PageHeaderProps {
  pageTitle: string;
  isMinimized: boolean;
  handleToggleMinimize: () => void;
  handleToggleSidebar: () => void;
  setSortBy?: React.Dispatch<React.SetStateAction<'importance' | 'dueDate' | 'alphabetically' | 'creationDate'>>;
  handleThemeChange: (theme: { backgroundColor?: string; backgroundImage?: string }) => void;
}

interface TasksPageProps {
  onTaskSelect: (task: Task) => void;
  tasks: Task[];
  isMinimized: boolean;
  handleToggleMinimize: () => void;
  handleToggleSidebar: () => void;
  handleThemeChange: (theme: { backgroundColor?: string; backgroundImage?: string }) => void;
  fontColor: string;
}

const TasksPage: React.FC<TasksPageProps> = ({ onTaskSelect, tasks, isMinimized, handleToggleMinimize, handleToggleSidebar, handleThemeChange }) => {
  const { user } = useAuth();
  const { addTask, deleteTask, updateTask } = useTasks(user);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskText, setNewTaskText] = useState('');

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

  const allTasks = tasks;

  return (
    <PageLayout isMinimized={isMinimized}>
      <PageHeader
        pageTitle="Tasks"
        isMinimized={isMinimized}
        handleToggleMinimize={handleToggleMinimize}
        handleToggleSidebar={handleToggleSidebar}
        handleThemeChange={handleThemeChange}
      />
      <TaskList
        tasks={allTasks}
        onTaskSelect={handleTaskSelect}
        pageName="Tasks"
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

export default TasksPage;
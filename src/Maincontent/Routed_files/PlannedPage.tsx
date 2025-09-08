// src/Maincontent/Routed_files/PlannedPage.tsx

import React, { useState } from 'react';
import PageLayout from './PageLayout';
import PageHeader from './PageHeader';
import TaskList from './TaskList';
import TaskBar from './TaskBar';
import { useAuth } from './useAuth';
import { useTasks } from './useTasks';
import TaskDetails from './TaskDetails';
import { Task } from '../../App';

interface PlannedPageProps {
  onTaskSelect: (task: Task) => void;
  tasks: Task[];
  onUpdateTask: (id: string, updatedFields: Partial<Task>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  isMinimized: boolean;
  handleToggleMinimize: () => void;
  handleToggleSidebar: () => void;
  handleThemeChange: (theme: { backgroundColor?: string; backgroundImage?: string }) => void;
}

const PlannedPage: React.FC<PlannedPageProps> = ({ onTaskSelect, tasks, onUpdateTask, onDeleteTask, isMinimized, handleToggleMinimize, handleToggleSidebar, handleThemeChange }) => {
  const { user } = useAuth();
  const { addTask } = useTasks(user);
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

  const handleUpdateTask = async (id: string, updatedFields: Partial<Task>) => {
    const updatedData: Partial<Task> = { ...updatedFields };
    if (updatedData.dueDate && typeof updatedData.dueDate === 'string' && isNaN(new Date(updatedData.dueDate).getTime())) {
      console.error('Invalid dueDate value:', updatedData.dueDate);
      delete updatedData.dueDate;
    }
    if (updatedData.reminder && typeof updatedData.reminder === 'string' && isNaN(new Date(updatedData.reminder).getTime())) {
      console.error('Invalid reminder value:', updatedData.reminder);
      delete updatedData.reminder;
    }
    await onUpdateTask(id, updatedData);
  };

  const handleFavoriteToggle = async () => {
    if (selectedTask) {
      const updatedFavorited = !selectedTask.favorited;
      await handleUpdateTask(selectedTask.id, { favorited: updatedFavorited });
      setSelectedTask(prevTask => prevTask ? { ...prevTask, favorited: updatedFavorited } : null);
    }
  };

  const handleDeleteTask = (id: string) => {
    onDeleteTask(id);
    if (selectedTask?.id === id) {
      handleCloseTaskDetails();
    }
  };

  const plannedTasks = tasks.filter(task => task.dueDate || task.reminder);

  return (
    <PageLayout isMinimized={isMinimized}>
      <PageHeader
        pageTitle="Planned"
        isMinimized={isMinimized}
        handleToggleMinimize={handleToggleMinimize}
        handleToggleSidebar={handleToggleSidebar}
        handleThemeChange={handleThemeChange}
      />
      <TaskList
        tasks={plannedTasks}
        onTaskSelect={handleTaskSelect}
        pageName="Planned"
        onUpdateTask={handleUpdateTask}
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
          onUpdateTask={handleUpdateTask}
          favorited={selectedTask.favorited}
          onFavoriteToggle={handleFavoriteToggle}
          creationTime={selectedTask.createdAt}
        />
      )}
    </PageLayout>
  );
};

export default PlannedPage;
// src/Maincontent/Routed_files/ImportantPage.tsx

import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import PageHeader from "../layouts/PageHeader";
import TaskList from "../components/Task/TaskList";
import TaskBar from "../components/Task/TaskItem";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import TaskDetails from "../components/Task/TaskDetails/TaskDetails";
import { Task } from "../App";

interface ImportantPageProps {
  onTaskSelect: (task: Task) => void;
  tasks: Task[];
  onUpdateTask: (id: string, updatedFields: Partial<Task>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  isMinimized: boolean;
  handleToggleMinimize: () => void;
  handleToggleSidebar: () => void;
  handleThemeChange: (theme: {
    backgroundColor?: string;
    backgroundImage?: string;
  }) => void;
}

const ImportantPage: React.FC<ImportantPageProps> = ({
  onTaskSelect,
  tasks,
  onUpdateTask,
  onDeleteTask,
  isMinimized,
  handleToggleMinimize,
  handleToggleSidebar,
  handleThemeChange,
}) => {
  const { user } = useAuth();
  const { addTask, deleteTask, updateTask } = useTasks(user);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = () => {
    if (newTaskText.trim() !== "") {
      addTask(newTaskText);
      setNewTaskText("");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
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
      setSelectedTask((prevTask: Task | null) =>
        prevTask ? { ...prevTask, favorited: !prevTask.favorited } : null
      );
    }
  };

  const handleDeleteTask = (id: string) => {
    onDeleteTask(id);
    if (selectedTask?.id === id) {
      handleCloseTaskDetails();
    }
  };

  const favoritedTasks = tasks.filter((task) => task.favorited);

  return (
    <PageLayout isMinimized={isMinimized}>
      <PageHeader
        pageTitle="Important"
        isMinimized={isMinimized}
        handleToggleMinimize={handleToggleMinimize}
        handleToggleSidebar={handleToggleSidebar}
        handleThemeChange={handleThemeChange}
      />
      <TaskList
        tasks={favoritedTasks}
        onTaskSelect={handleTaskSelect}
        pageName="Important"
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

export default ImportantPage;

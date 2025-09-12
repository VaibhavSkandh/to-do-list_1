// src/Maincontent/Routed_files/TasksPage.tsx

import React, { useState } from "react";
import PageLayout from "../components/PageLayout";
import PageHeader from "../layouts/PageHeader";
import TaskList from "../components/Task/TaskList";
import TaskBar from "../components/Task/TaskItem";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import TaskDetails from "../components/Task/TaskDetails/Task_Details";
import { Task } from "../App";

interface TasksPageProps {
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

const TasksPage: React.FC<TasksPageProps> = ({
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
  const { addTask } = useTasks(user);
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

  const handleUpdateTask = async (id: string, updatedFields: Partial<Task>) => {
    const updatedData: Partial<Task> = { ...updatedFields };
    if (
      updatedData.dueDate &&
      typeof updatedData.dueDate === "string" &&
      isNaN(new Date(updatedData.dueDate).getTime())
    ) {
      console.error("Invalid dueDate value:", updatedData.dueDate);
      delete updatedData.dueDate;
    }
    if (
      updatedData.reminder &&
      typeof updatedData.reminder === "string" &&
      isNaN(new Date(updatedData.reminder).getTime())
    ) {
      console.error("Invalid reminder value:", updatedData.reminder);
      delete updatedData.reminder;
    }
    await onUpdateTask(id, updatedData);
  };

  const handleFavoriteToggle = async () => {
    if (selectedTask) {
      const updatedFavorited = !selectedTask.favorited;
      await handleUpdateTask(selectedTask.id, { favorited: updatedFavorited });
      setSelectedTask((prevTask) =>
        prevTask ? { ...prevTask, favorited: updatedFavorited } : null
      );
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
        pageTitle="Tasks"
        isMinimized={isMinimized}
        handleToggleMinimize={handleToggleMinimize}
        handleToggleSidebar={handleToggleSidebar}
        handleThemeChange={handleThemeChange}
      />
      <TaskList
        tasks={tasks}
        onTaskSelect={handleTaskSelect}
        pageName="Tasks"
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

export default TasksPage;

// src/Maincontent/Routed_files/MyDayPage.tsx

import React, { useState, useMemo } from "react";
import styles from "./MyDayPage.module.scss";
import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";
import TaskDetails from "../components/Task/TaskDetails/Task_Details";
import PageLayout from "../components/PageLayout";
import PageHeader from "../layouts/PageHeader";
import TaskList from "../components/Task/TaskList";
import TaskBar from "../components/Task/TaskItem";
import { Task } from "../App";

interface MyDayPageProps {
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

const MyDayPage: React.FC<MyDayPageProps> = ({
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
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<
    "importance" | "dueDate" | "alphabetically" | "creationDate"
  >("creationDate");

  const getSortedTasks = useMemo(() => {
    let sortedTasks = [...tasks];
    switch (sortBy) {
      case "importance":
        sortedTasks.sort(
          (a, b) => (b.favorited ? 1 : -1) - (a.favorited ? 1 : -1)
        );
        break;
      case "dueDate":
        sortedTasks.sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return dateA - dateB;
        });
        break;
      case "alphabetically":
        sortedTasks.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case "creationDate":
      default:
        sortedTasks.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );
        break;
    }
    return sortedTasks;
  }, [tasks, sortBy]);

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

export default MyDayPage;

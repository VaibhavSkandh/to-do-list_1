// src/Maincontent/Maincontent.tsx

import React, { useState } from "react";
import styles from "./Maincontent.module.scss";
import { Routes, Route } from "react-router-dom";
import { Task } from "../../App";

import MyDayPage from "../../pages/MyDayPage";
import ImportantPage from "../../pages/ImportantPage";
import PlannedPage from "../../pages/PlannedPage";
import AssignedPage from "../../pages/AssignedPage";
import TasksPage from "../../pages/TasksPage";

interface MainContentProps {
  onTaskSelect: (task: Task) => void;
  tasks: Task[];
  onUpdateTask: (id: string, updatedFields: Partial<Task>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  isMinimized: boolean;
  handleToggleMinimize: () => void;
  handleToggleSidebar: () => void;
}

const getContrastColor = (hex: string) => {
  if (!hex) return "#FFFFFF";
  const hexColor = hex.startsWith("#") ? hex.slice(1) : hex;
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};

const MainContent: React.FC<MainContentProps> = ({
  onTaskSelect,
  tasks,
  onUpdateTask,
  onDeleteTask,
  isMinimized,
  handleToggleMinimize,
  handleToggleSidebar,
}) => {
  const [theme, setTheme] = useState({
    backgroundImage: "",
    backgroundColor: "#87CEEB",
    fontColor: "#000000",
  });

  const handleThemeChange = (newTheme: {
    backgroundColor?: string;
    backgroundImage?: string;
    fontColor?: string;
  }) => {
    setTheme((prevTheme) => {
      let newFontColor = newTheme.fontColor || prevTheme.fontColor;
      let newBackgroundColor =
        newTheme.backgroundColor || prevTheme.backgroundColor;
      let newBackgroundImage =
        newTheme.backgroundImage || prevTheme.backgroundImage;

      if (newTheme.backgroundColor) {
        newFontColor = getContrastColor(newTheme.backgroundColor);
      }

      return {
        ...prevTheme,
        ...newTheme,
        fontColor: newFontColor,
        backgroundColor: newBackgroundColor,
        backgroundImage: newBackgroundImage,
      };
    });
  };

  const favoritedTasks = tasks.filter((task) => task.favorited);
  const plannedTasks = tasks.filter(
    (task) =>
      (task.dueDate !== null &&
        task.dueDate !== undefined &&
        task.dueDate !== "") ||
      (task.reminder !== null &&
        task.reminder !== undefined &&
        task.reminder !== "")
  );

  const assignedTasks = tasks.filter((task) => task.text.includes("@"));
  const allTasks = tasks;

  return (
    <main
      className={styles.mainContent}
      style={{
        backgroundImage: `url(${theme.backgroundImage})`,
        backgroundColor: theme.backgroundColor,
      }}
    >
      <div className={styles.mainContainer}>
        <div className={styles.taskContainer}>
          <Routes>
            <Route
              path="/"
              element={
                <MyDayPage
                  onTaskSelect={onTaskSelect}
                  tasks={tasks}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                  isMinimized={isMinimized}
                  handleToggleMinimize={handleToggleMinimize}
                  handleToggleSidebar={handleToggleSidebar}
                  handleThemeChange={handleThemeChange}
                />
              }
            />
            <Route
              path="/important"
              element={
                <ImportantPage
                  onTaskSelect={onTaskSelect}
                  tasks={favoritedTasks}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                  isMinimized={isMinimized}
                  handleToggleMinimize={handleToggleMinimize}
                  handleToggleSidebar={handleToggleSidebar}
                  handleThemeChange={handleThemeChange}
                />
              }
            />
            <Route
              path="/planned"
              element={
                <PlannedPage
                  onTaskSelect={onTaskSelect}
                  tasks={plannedTasks}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                  isMinimized={isMinimized}
                  handleToggleMinimize={handleToggleMinimize}
                  handleToggleSidebar={handleToggleSidebar}
                  handleThemeChange={handleThemeChange}
                />
              }
            />
            <Route
              path="/assigned"
              element={
                <AssignedPage
                  onTaskSelect={onTaskSelect}
                  tasks={assignedTasks}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                  isMinimized={isMinimized}
                  handleToggleMinimize={handleToggleMinimize}
                  handleToggleSidebar={handleToggleSidebar}
                  handleThemeChange={handleThemeChange}
                />
              }
            />
            <Route
              path="/tasks"
              element={
                <TasksPage
                  onTaskSelect={onTaskSelect}
                  tasks={allTasks}
                  onUpdateTask={onUpdateTask}
                  onDeleteTask={onDeleteTask}
                  isMinimized={isMinimized}
                  handleToggleMinimize={handleToggleMinimize}
                  handleToggleSidebar={handleToggleSidebar}
                  handleThemeChange={handleThemeChange}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </main>
  );
};

export default MainContent;

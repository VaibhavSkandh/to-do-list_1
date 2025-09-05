import React, { useState } from "react";
import styles from "./Maincontent.module.scss";
import { Routes, Route } from "react-router-dom";

import MyDayPage from "../Maincontent/Routed_files/MyDayPage";
import ImportantPage from "../Maincontent/Routed_files/ImportantPage";
import PlannedPage from "../Maincontent/Routed_files/PlannedPage";
import AssignedPage from "../Maincontent/Routed_files/AssignedPage";
import TasksPage from "../Maincontent/Routed_files/TasksPage";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  favorited: boolean;
  dueDate?: Date;
}

interface MainContentProps {
  onTaskSelect: (task: Task) => void;
  tasks: Task[];
  isMinimized: boolean;
  handleToggleMinimize: () => void;
  handleToggleSidebar: () => void;
}

const getContrastColor = (hex: string) => {
  if (!hex) return '#FFFFFF';
  const hexColor = hex.startsWith('#') ? hex.slice(1) : hex;
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
};

const MainContent: React.FC<MainContentProps> = ({ onTaskSelect, tasks, isMinimized, handleToggleMinimize, handleToggleSidebar }) => {
  const [theme, setTheme] = useState({
    backgroundImage: '',
    backgroundColor: '#87CEEB', 
    fontColor: '#000000', 
  });

  const handleThemeChange = (newTheme: { backgroundColor?: string; backgroundImage?: string; fontColor?: string }) => {
    setTheme(prevTheme => {
      let newFontColor = newTheme.fontColor || prevTheme.fontColor;
      let newBackgroundColor = newTheme.backgroundColor || prevTheme.backgroundColor;
      let newBackgroundImage = newTheme.backgroundImage || prevTheme.backgroundImage;

      if (newTheme.backgroundColor) {
        newFontColor = getContrastColor(newTheme.backgroundColor);
      }
      if (newTheme.backgroundImage) {
        newFontColor = '#FFFFFF';
      }

      return {
        backgroundImage: newBackgroundImage,
        backgroundColor: newBackgroundColor,
        fontColor: newFontColor
      };
    });
  };

  const getSortedTasks = tasks.sort((a, b) => a.text.localeCompare(b.text));
  const favoritedTasks = tasks.filter(task => task.favorited);
  const plannedTasks = tasks.filter(task => task.dueDate);
  const assignedTasks = tasks.filter(task => false);
  const allTasks = tasks;

  const mainStyle = {
    backgroundImage: theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none',
    backgroundColor: theme.backgroundColor || 'transparent',
    color: theme.fontColor || '#000000'
  };

  return (
    <main className={styles.mainContentContainer}>
      <div className={styles.mainContainer} style={mainStyle}>
        <div className={styles.taskContainer} style={mainStyle}>
          <Routes>
            <Route path="/" element={<MyDayPage onTaskSelect={onTaskSelect} tasks={tasks} isMinimized={isMinimized} handleToggleMinimize={handleToggleMinimize} handleToggleSidebar={handleToggleSidebar} handleThemeChange={handleThemeChange} fontColor={theme.fontColor} currentBackground={theme.backgroundImage || theme.backgroundColor}/>} />
            <Route path="/important" element={<ImportantPage onTaskSelect={onTaskSelect} tasks={favoritedTasks} isMinimized={isMinimized} handleToggleMinimize={handleToggleMinimize} handleToggleSidebar={handleToggleSidebar} handleThemeChange={handleThemeChange} fontColor={theme.fontColor} />} />
            <Route path="/planned" element={<PlannedPage onTaskSelect={onTaskSelect} tasks={plannedTasks} isMinimized={isMinimized} handleToggleMinimize={handleToggleMinimize} handleToggleSidebar={handleToggleSidebar} handleThemeChange={handleThemeChange} fontColor={theme.fontColor} />} />
            <Route path="/assigned" element={<AssignedPage onTaskSelect={onTaskSelect} tasks={assignedTasks} isMinimized={isMinimized} handleToggleMinimize={handleToggleMinimize} handleToggleSidebar={handleToggleSidebar} handleThemeChange={handleThemeChange} fontColor={theme.fontColor} />} />
            <Route path="/tasks" element={<TasksPage onTaskSelect={onTaskSelect} tasks={allTasks} isMinimized={isMinimized} handleToggleMinimize={handleToggleMinimize} handleToggleSidebar={handleToggleSidebar} handleThemeChange={handleThemeChange} fontColor={theme.fontColor} />} />
          </Routes>
        </div>
      </div>
    </main>
  );
};

export default MainContent;

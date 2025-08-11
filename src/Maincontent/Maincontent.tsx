// src/Maincontent/Maincontent.tsx

import React, { useState } from "react";
import styles from "./Maincontent.module.scss";
import { Routes, Route } from "react-router-dom";

// Import all the routed pages
import MyDayPage from "../Maincontent/Routed_files/MyDayPage";
import ImportantPage from "../Maincontent/Routed_files/ImportantPage";
import PlannedPage from "../Maincontent/Routed_files/PlannedPage";
import AssignedPage from "../Maincontent/Routed_files/AssignedPage";
import TasksPage from "../Maincontent/Routed_files/TasksPage";

// Define the shape of the props that MainContent expects
interface MainContentProps {
  onTaskSelect: (task: { id: string; title: string }) => void;
}

const MainContent: React.FC<MainContentProps> = ({ onTaskSelect }) => {
  const [currentBackground, setCurrentBackground] = useState('');

  const handleThemeChange = (theme: string) => {
    setCurrentBackground(theme);
  };

  return (
    <main
      className={styles.mainContent}
      style={{
        backgroundImage: currentBackground.startsWith('#') ? 'none' : `url(${currentBackground})`,
        backgroundColor: currentBackground.startsWith('#') ? currentBackground : '#2d2d3e',
      }}
    >
      <div className={styles.overlay}>
        <div className={styles.taskContainer}>
          <Routes>
            <Route path="/" element={<MyDayPage currentBackground={currentBackground} handleThemeChange={handleThemeChange} onTaskSelect={onTaskSelect} />} />
            <Route path="/important" element={<ImportantPage onTaskSelect={onTaskSelect} />} />
            <Route path="/planned" element={<PlannedPage onTaskSelect={onTaskSelect} />} />
            <Route path="/assigned" element={<AssignedPage onTaskSelect={onTaskSelect} />} />
            <Route path="/tasks" element={<TasksPage onTaskSelect={onTaskSelect} />} />
          </Routes>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
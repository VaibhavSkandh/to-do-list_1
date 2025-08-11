import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import MainContent from "./Maincontent/Maincontent";
import Login from "./Login/Login";
import TaskDetails from './Maincontent/Routed_files/TaskDetails';
import styles from "./App.module.scss";
import { useAuth } from "./Maincontent/Routed_files/useAuth";
import { User } from "firebase/auth";

const App: React.FC = () => {
  const { user, loading, signInWithGoogle, handleSignOut } = useAuth();
  const [activeItem, setActiveItem] = useState("my-day");
  const [selectedTask, setSelectedTask] = useState<{ id: string; title: string } | null>(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleTaskSelect = (task: { id: string; title: string }) => {
    setSelectedTask(task);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
  };

  return (
    <Router>
      <div className={styles.appContainer}>
        {user ? (
          <>
            <Sidebar
              user={user as User}
              onSignOut={handleSignOut}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
            <MainContent onTaskSelect={handleTaskSelect} />

            {selectedTask && (
              <TaskDetails
                taskTitle={selectedTask.title}
                onClose={handleCloseDetails}
              />
            )}
          </>
        ) : (
          <Login onSignIn={signInWithGoogle} />
        )}
      </div>
    </Router>
  );
};

export default App;
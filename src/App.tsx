import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import MainContent from "./Maincontent/Maincontent";
import Login from "./Login/Login";
import TaskDetails from './Maincontent/Routed_files/TaskDetails';
import styles from "./App.module.scss";
import { useAuth } from "./Maincontent/Routed_files/useAuth";
import { useTasks } from './Maincontent/Routed_files/useTasks';
import { User } from "firebase/auth";

// Define a type for the task to avoid type errors
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const App: React.FC = () => {
  const { user, loading, signInWithGoogle, handleSignOut } = useAuth();
  const { deleteTask } = useTasks(user);
  const [activeItem, setActiveItem] = useState("my-day");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
  };
  
  const handleDeleteTask = async (id: string) => {
    if (user) {
      await deleteTask(id);
      setSelectedTask(null);
    }
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <Router>
      <div className={`${styles.appContainer} ${isMinimized ? styles.minimized : ''}`}>
        {user ? (
          <>
            <Sidebar
              user={user as User}
              onSignOut={handleSignOut}
              activeItem={activeItem}
              setActiveItem={setActiveItem}
            />
            <MainContent onTaskSelect={handleTaskSelect} isMinimized={isMinimized} handleToggleMinimize={handleToggleMinimize} />

            {selectedTask && (
              <TaskDetails
                taskTitle={selectedTask.text}
                taskId={selectedTask.id}
                onClose={handleCloseDetails}
                onDelete={handleDeleteTask} 
                favorited={false}
                onFavoriteToggle={() => {}}
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
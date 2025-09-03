import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import MainContent from "./Maincontent/Maincontent";
import Login from "./Login/Login";
import TaskDetails from './Maincontent/Routed_files/TaskDetails';
import styles from "./App.module.scss";
import { useAuth } from "./Maincontent/Routed_files/useAuth";
import { useTasks } from './Maincontent/Routed_files/useTasks';
import { User } from "firebase/auth";
import PrivateRoute from "./Maincontent/Routed_files/PrivateRoute";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  favorited: boolean;
  dueDate?: Date;
}

const App: React.FC = () => {
  const { user, loading, signInWithGoogle, handleSignOut } = useAuth();
  const { tasks, deleteTask } = useTasks(user);
  const [activeItem, setActiveItem] = useState("my-day");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

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

  const handleToggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <Router>
      <div className={`${styles.appContainer} ${isMinimized ? styles.minimized : ''}`}>
        <Routes>
          <Route path="/login" element={<Login onSignIn={signInWithGoogle} />} />
          <Route element={<PrivateRoute />}>
            <Route path="*" element={
              <>
                <Sidebar
                  user={user as User}
                  onSignOut={handleSignOut}
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  isVisible={isSidebarVisible}
                  isMinimized={isMinimized}
                  setIsMinimized={setIsMinimized}
                />
                <MainContent
                  onTaskSelect={handleTaskSelect}
                  tasks={tasks}
                  isMinimized={isMinimized}
                  handleToggleMinimize={handleToggleMinimize}
                  handleToggleSidebar={handleToggleSidebar}
                />

                {selectedTask && (
                  <TaskDetails
                    taskTitle={selectedTask.text}
                    taskId={selectedTask.id}
                    onClose={handleCloseDetails}
                    onDelete={handleDeleteTask}
                    favorited={selectedTask.favorited}
                    onFavoriteToggle={() => {}}
                    creationTime={selectedTask.createdAt}
                  />
                )}
              </>
            } />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import MainContent from "./components/Main/Maincontent";
import Login from "./components/Login/Login";
import TaskDetails from "./components/Task/TaskDetails/TaskDetails";
import styles from "./App.module.scss";
import { useAuth } from "./hooks/useAuth";
import { useTasks } from "./hooks/useTasks";
import { User } from "firebase/auth";
import PrivateRoute from "./routes/PrivateRoute";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  favorited: boolean;
  dueDate?: string | Date | null;
  reminder?: Date | string | null;
  repeat?: string | null;
}

// All application logic is moved into this new component
const MainAppLogic: React.FC = () => {
  const { user, loading, signInWithGoogle, handleSignOut } = useAuth();
  const { tasks, addTask, deleteTask, updateTask } = useTasks(user);
  const [activeItem, setActiveItem] = useState("my-day");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
  };

  const handleUpdateTask = async (id: string, updatedFields: Partial<Task>) => {
    if (user) {
      await updateTask(id, updatedFields);
      setSelectedTask((prevTask) => {
        if (!prevTask) return null;
        return prevTask.id === id
          ? { ...prevTask, ...updatedFields }
          : prevTask;
      });
    }
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

  const importantCount = tasks.filter((task) => task.favorited).length;
  const assignedCount = tasks.filter((task) => task.text.includes("@")).length;
  const plannedCount = tasks.filter(
    (task) => task.dueDate || task.reminder
  ).length;

  return (
    <div
      className={`${styles.appContainer} ${
        isMinimized ? styles.minimized : ""
      }`}
    >
      <Routes>
        <Route path="/login" element={<Login onSignIn={signInWithGoogle} />} />
        <Route
          path="/*"
          element={
            <PrivateRoute user={user}>
              <>
                <Sidebar
                  user={user as User}
                  onSignOut={handleSignOut}
                  activeItem={activeItem}
                  setActiveItem={setActiveItem}
                  isVisible={isSidebarVisible}
                  isMinimized={isMinimized}
                  setIsMinimized={setIsMinimized}
                  tasks={tasks}
                  importantCount={importantCount}
                  assignedCount={assignedCount}
                  plannedCount={plannedCount}
                />
                <MainContent
                  onTaskSelect={handleTaskSelect}
                  tasks={tasks}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
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
                    onUpdateTask={handleUpdateTask}
                    favorited={selectedTask.favorited}
                    onFavoriteToggle={() => {}}
                    creationTime={selectedTask.createdAt}
                  />
                )}
              </>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <MainAppLogic />
    </Router>
  );
};

export default App;

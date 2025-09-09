import React, { useState } from "react";
import styles from "./Sidebar.module.scss";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Task } from "../../App";

interface SidebarProps {
  user: User | null;
  onSignOut: () => void;
  activeItem: string;
  setActiveItem: (itemId: string) => void;
  isVisible: boolean;
  isMinimized: boolean;
  setIsMinimized: (isMinimized: boolean) => void;
  tasks: Task[];
  importantCount: number;
  assignedCount: number;
  plannedCount: number;
  onTaskSelect: (task: Task) => void; // ✅ new prop
}

interface NavItem {
  id: string;
  icon: string;
  text: string;
  path: string;
  count?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  onSignOut,
  activeItem,
  setActiveItem,
  isVisible,
  isMinimized,
  setIsMinimized,
  tasks,
  importantCount,
  assignedCount,
  plannedCount,
  onTaskSelect,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Absolute paths
  const navItems: NavItem[] = [
    { id: "my-day", icon: "light_mode", text: "My Day", path: "/" },
    { id: "important", icon: "star", text: "Important", path: "/important", count: importantCount },
    { id: "planned", icon: "calendar_month", text: "Planned", path: "/planned", count: plannedCount },
    { id: "assigned", icon: "person", text: "Assigned to me", path: "/assigned", count: assignedCount },
    { id: "tasks", icon: "list_alt", text: "Tasks", path: "/tasks", count: tasks.length },
  ];

  const handleNavigation = (item: NavItem) => {
    setActiveItem(item.id);
    navigate(item.path, { replace: true });
  };

  // ✅ Filter tasks by search
  const filteredTasks = searchQuery
    ? tasks.filter((t) =>
        t.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleTaskClick = (task: Task) => {
    navigate("/tasks", { replace: true }); // Go to Tasks page
    onTaskSelect(task); // ✅ Open TaskDetails
    setSearchQuery(""); // Clear search
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <aside
        className={`${styles.sidebar} ${
          !isVisible ? styles.sidebarHidden : ""
        } ${isMinimized ? styles.minimizedSidebar : ""}`}
      >
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <div className={styles.userName}>
                Hi, {user.displayName || "User Name"}
              </div>
            </div>
          </div>
        )}

        {/* ✅ Search Bar */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="material-icons">search</span>
        </div>

        {/* ✅ Search Results Dropdown */}
        {searchQuery && (
          <div className={styles.searchResults}>
            {filteredTasks.length > 0 ? (
              <ul>
                {filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    className={styles.searchResultItem}
                    onClick={() => handleTaskClick(task)}
                  >
                    {task.text}
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.noResults}>No matching tasks</div>
            )}
          </div>
        )}

        <nav className={styles.navigation}>
          <ul>
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`${styles.navItem} ${
                  activeItem === item.id ? styles.active : ""
                }`}
              >
                <button
                  className={styles.navButton}
                  onClick={() => handleNavigation(item)}
                >
                  <div className={styles.navContent}>
                    <span className={`material-icons ${styles.navIcon}`}>
                      {item.icon}
                    </span>
                    {!isMinimized && (
                      <span className={styles.navText}>{item.text}</span>
                    )}
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={styles.taskCount}>{item.count}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <hr className={styles.divider} />
        </nav>

        <div className={styles.bottomActions}>
          <button onClick={onSignOut} className={styles.signOutButton}>
            <span className="material-icons">logout</span>
            {!isMinimized && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

// Sidebar.tsx
import React from 'react';
import styles from './Sidebar.module.scss';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  user: User | null;
  onSignOut: () => void;
  activeItem: string;
  setActiveItem: (itemId: string) => void;
  isVisible: boolean;
  isMinimized: boolean; 
  setIsMinimized: (isMinimized: boolean) => void;
}

interface NavItem {
  id: string;
  icon: string;
  text: string;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onSignOut, activeItem, setActiveItem, isVisible, isMinimized, setIsMinimized }) => {
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { id: 'my-day', icon: 'light_mode', text: 'My Day', path: '/' },
    { id: 'important', icon: 'star', text: 'Important', path: '/important' },
    { id: 'planned', icon: 'calendar_month', text: 'Planned', path: '/planned' },
    { id: 'assigned', icon: 'person', text: 'Assigned to me', path: '/assigned' },
    { id: 'tasks', icon: 'list_alt', text: 'Tasks', path: '/tasks' },
  ];

  const handleNavigation = (item: NavItem) => {
    setActiveItem(item.id);
    navigate(item.path);
  };

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <aside className={`${styles.sidebar} ${!isVisible ? styles.sidebarHidden : ''} ${isMinimized ? styles.minimizedSidebar : ''}`}>
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <div className={styles.userName}>Hi, {user.displayName || 'User Name'}</div>
            </div>
          </div>
        )}
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search" />
          <span className="material-icons">search</span>
        </div>
        
        <nav className={styles.navigation}>
          <ul>
            {navItems.map((item) => (
              <li
                key={item.id}
                className={`${styles.navItem} ${activeItem === item.id ? styles.active : ''}`}
              >
                <button
                  className={styles.navButton}
                  onClick={() => handleNavigation(item)}
                >
                  <span className={`material-icons ${styles.navIcon}`}>{item.icon}</span>
                  {!isMinimized && <span className={styles.navText}>{item.text}</span>}
                </button>
              </li>
            ))}
          </ul>
          <hr className={styles.divider} />
        </nav>
        <div className={styles.bottomActions}>
          <button className={styles.newListButton}>
            <span className="material-icons">add</span>
            {!isMinimized && <span>New list</span>}
          </button>
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
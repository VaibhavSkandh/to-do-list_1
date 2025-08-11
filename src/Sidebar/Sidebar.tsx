import React from 'react';
import styles from './Sidebar.module.scss';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  user: User | null;
  onSignOut: () => void;
  activeItem: string;
  setActiveItem: (itemId: string) => void;
}

// Define the type for a navigation item
interface NavItem {
  id: string;
  icon: string;
  text: string;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onSignOut, activeItem, setActiveItem }) => {
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
    <aside className={styles.sidebar}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
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
                <span className={styles.navText}>{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
        <hr className={styles.divider} />
      </nav>
      <div className={styles.bottomActions}>
        <button className={styles.newListButton}>
          <span className="material-icons">add</span> New list
        </button>
        <button onClick={onSignOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
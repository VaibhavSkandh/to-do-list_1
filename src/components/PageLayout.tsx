import React from 'react';
import styles from './Task/TaskDetails/TaskDetails.module.scss';

interface PageLayoutProps {
  children: React.ReactNode;
  isMinimized: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, isMinimized }) => {
  return (
    <div
      className={`${styles.myDayLayout} ${isMinimized ? styles.minimized : ''}`}
      role="main"
      aria-hidden={isMinimized}
    >
      {children}
    </div>
  );
};

export default React.memo(PageLayout);
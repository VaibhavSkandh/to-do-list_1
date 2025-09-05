import React from 'react';
import styles from './MyDayPage.module.scss';

interface PageLayoutProps {
  children: React.ReactNode;
  isMinimized: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, isMinimized }) => {
  return (
    <div className={`${styles.myDayLayout} ${isMinimized ? styles.minimized : ''}`}>
      {children}
    </div>
  );
};

export default PageLayout;
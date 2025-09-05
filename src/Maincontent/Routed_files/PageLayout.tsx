import React, { useState } from 'react';
import styles from './MyDayPage.module.scss';

interface PageLayoutProps {
  children: React.ReactNode;
  isMinimized: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, isMinimized }) => {
  const [currentBackground, setCurrentBackground] = useState('');
  const [currentThemeColor, setCurrentThemeColor] = useState('white');
  
  return (
    <div
      className={`${styles.myDayLayout} ${isMinimized ? styles.minimized : ''}`}
      style={{
        backgroundImage: currentBackground.startsWith('http') ? `url(${currentBackground})` : 'none',
        backgroundColor: !currentBackground.startsWith('http') ? currentBackground : '',
        backgroundSize: 'cover',
        '--font-color': currentThemeColor,
      } as React.CSSProperties}>
      <div className={styles.myDayContainer}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;

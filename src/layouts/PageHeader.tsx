import React, { useState } from 'react';
import styles from '../pages/MyDayPage.module.scss';
import image1 from '../assets/images/pexels-quang-nguyen-vinh-222549-2166711.jpg'
import image2 from '../assets/images/image1.png';
import image3 from '../assets/images/pexels-bri-schneiter-28802-346529.jpg';
import image4 from '../assets/images/pexels-maxfrancis-2246476.jpg';
import image5 from '../assets/images/pexels-pixabay-268533.jpg';



interface PageHeaderProps {
  pageTitle: string;
  isMinimized: boolean;
  handleToggleMinimize: () => void;
  handleToggleSidebar: () => void;
  setSortBy?: (sort: 'importance' | 'dueDate' | 'alphabetically' | 'creationDate') => void;
  handleThemeChange: (theme: { backgroundColor?: string; backgroundImage?: string; fontColor?: string }) => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ pageTitle, isMinimized, handleToggleMinimize, handleToggleSidebar, setSortBy, handleThemeChange }) => {
  const [showMorePanel, setShowMorePanel] = useState(false);
  const [showThemesPanel, setShowThemesPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);

  const themeColors = [
    '#000000', // Black
    '#FFFFFF', // White
    '#0000FF', // Blue
    '#008000', // Green
    '#FFA500', // Orange
    '#FF0000', // Red
    '#800080', // Purple
  ];

  const themeBackgrounds = [
    image1,
    image2,
    image3,
    image4,
    image5,
  ];

  const updateTheme = (theme: { backgroundColor?: string; backgroundImage?: string; fontColor?: string }) => {
    const root = document.documentElement;

    if (theme.fontColor !== undefined) {
      root.style.setProperty('--font-color', theme.fontColor);
    }
    if (theme.backgroundColor !== undefined) {
      root.style.setProperty('--background-color', theme.backgroundColor);
      root.style.setProperty('--background-image', 'none');
    }
    if (theme.backgroundImage !== undefined) {
      root.style.setProperty('--background-image', `url("${theme.backgroundImage}")`);
      root.style.setProperty('--background-color', 'transparent');
    }
    
    handleThemeChange(theme);
  };

  const handleFontColorChange = (color: string) => {
    updateTheme({ fontColor: color });
  };
  
  const handleBackgroundColorChange = (color: string) => {
    updateTheme({ backgroundColor: color });
  };

  const handleImageThemeChange = (background: string) => {
    updateTheme({ backgroundImage: background });
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        {isMinimized && (
          <button className={styles.headerIcon} onClick={handleToggleSidebar}>
            <span className="material-icons">menu</span>
          </button>
        )}
        <h1 className={styles.pageTitle}>{pageTitle}</h1>
        {pageTitle === 'My Day' && (
          <div className={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        )}
      </div>
      <div className={styles.headerRight}>
        <button className={styles.headerIcon} onClick={handleToggleMinimize}>
          <span role="img" aria-label="fullscreen-zoom-icon" className="material-icons">{isMinimized ? 'fullscreen' : 'fullscreen_exit'}</span>
        </button>
        {!isMinimized && (
          <>
            <button className={styles.headerIcon} onClick={() => console.log('Lightbulb clicked')}>
              <span role="img" aria-label="lightbulb-icon" className="material-icons">lightbulb_outline</span>
            </button>
            <button className={styles.headerIcon} onClick={() => setShowMorePanel(!showMorePanel)}>
              <span role="img" aria-label="more-options-icon" className="material-icons">more_horiz</span>
            </button>
          </>
        )}
        {showMorePanel && (
          <div className={styles.moreOptionsPanel}>
            {setSortBy && (
              <div className={styles.moreOption} onClick={() => setShowSortPanel(!showSortPanel)}>
                <span className={`${styles.moreIcon} material-icons`}>sort</span> Sort by
              </div>
            )}
            {showSortPanel && setSortBy && (
              <div className={styles.nestedPanel}>
                <div className={styles.sortOption} onClick={() => { setSortBy('importance'); setShowSortPanel(false); }}>Importance</div>
                <div className={styles.sortOption} onClick={() => { setSortBy('dueDate'); setShowSortPanel(false); }}>Due date</div>
                <div className={styles.sortOption} onClick={() => { setSortBy('alphabetically'); setShowSortPanel(false); }}>Alphabetically</div>
                <div className={styles.sortOption} onClick={() => { setSortBy('creationDate'); setShowSortPanel(false); }}>Creation date</div>
              </div>
            )}
            <div className={styles.moreOption} onClick={() => setShowThemesPanel(!showThemesPanel)}>
              <span className={`${styles.moreIcon} material-icons`}>palette</span> Theme
            </div>
            {showThemesPanel && (
              <div className={styles.nestedPanel}>
                <div style={{ padding: '0.5rem 1rem', color: 'white' }}>Font Colors</div>
                <div className={styles.colorOptions}>
                  {themeColors.map((color, index) => (
                    <div key={`font-${index}`} className={styles.themeOption} onClick={() => handleFontColorChange(color)}>
                      <div className={styles.themeCircle} style={{ backgroundColor: color }}></div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.5rem 1rem', marginTop: '1rem', color: 'white' }}>Background Colors</div>
                <div className={styles.colorOptions}>
                  {themeColors.map((color, index) => (
                    <div key={`bg-${index}`} className={styles.themeOption} onClick={() => handleBackgroundColorChange(color)}>
                      <div className={styles.themeCircle} style={{ backgroundColor: color }}></div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0.5rem 1rem', marginTop: '1rem', color: 'white' }}>Background Images</div>
                <div className={styles.colorOptions}>
                  {themeBackgrounds.map((background, index) => (
                    <div key={`img-${index}`} className={styles.themeOption} onClick={() => handleImageThemeChange(background)}>
                      <div className={styles.themeCircle} style={{ backgroundImage: `url("${background}")`, backgroundSize: 'cover' }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.moreOption} onClick={() => console.log('Hide completed tasks clicked')}>
              <span className={`${styles.moreIcon} material-icons`}>check_box_outline_blank</span> Hide completed tasks
            </div>
            <div className={styles.moreOption} onClick={() => console.log('Print list clicked')}>
              <span className={`${styles.moreIcon} material-icons`}>print</span> Print list
            </div>
            <div className={styles.moreOption} onClick={() => console.log('Email list clicked')}>
              <span className={`${styles.moreIcon} material-icons`}>mail_outline</span> Email list
            </div>
            <div className={styles.moreOption} onClick={() => console.log('Pin to start clicked')}>
              <span className={`${styles.moreIcon} material-icons`}>push_pin</span> Pin to start
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
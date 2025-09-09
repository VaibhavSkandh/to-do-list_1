import React from 'react';
import styles from '../components/Task/TaskDetails/TaskDetails.module.scss';

interface RepeatProps {
  onSetRepeat: (value: string) => void;
  onClose: () => void;
}

const Repeat: React.FC<RepeatProps> = ({ onSetRepeat, onClose }) => {
  const repeatOptions = ['Daily', 'Weekdays', 'Weekly', 'Monthly', 'Yearly', 'Custom'];

  return (
    <div className={styles.optionPanel}>
      {repeatOptions.map(option => (
        <div key={option} className={styles.optionItem} onClick={() => onSetRepeat(option)}>
          {option}
        </div>
      ))}
    </div>
  );
};

export default Repeat;
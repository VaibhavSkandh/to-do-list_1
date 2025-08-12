import React from 'react';
import styles from '../TaskDetails.module.scss';

interface AddDueDateProps {
  onSetDueDate: (value: string) => void;
  onClose: () => void;
}

const AddDueDate: React.FC<AddDueDateProps> = ({ onSetDueDate, onClose }) => {
  const dueDateOptions = [
    { label: 'Today', value: 'Today' },
    { label: 'Tomorrow', value: 'Tomorrow' },
    { label: 'Next week', value: 'Next week' },
  ];

  return (
    <div className={styles.optionPanel}>
      {dueDateOptions.map(option => (
        <div key={option.value} className={styles.optionItem} onClick={() => onSetDueDate(option.value)}>
          {option.label}
        </div>
      ))}
      <div className={styles.optionItem}>
        <input
          type="date"
          className={styles.datePicker}
          onChange={(e) => onSetDueDate(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AddDueDate;

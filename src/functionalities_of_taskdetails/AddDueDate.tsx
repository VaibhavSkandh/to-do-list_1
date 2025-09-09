import React, { useState } from 'react';
import styles from '../components/Task/TaskDetails/TaskDetails.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AddDueDateProps {
  onSetDueDate: (value: string | null) => void;
  onClose: () => void;
}

const AddDueDate: React.FC<AddDueDateProps> = ({ onSetDueDate, onClose }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const dueDateOptions = [
    { label: 'Today', value: 'Today' },
    { label: 'Tomorrow', value: 'Tomorrow' },
    { label: 'Next week', value: 'Next week' },
  ];

  const handleDateOptionClick = (value: string) => {
    onSetDueDate(value);
    onClose();
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleSaveClick = () => {
    if (selectedDate) {
      onSetDueDate(selectedDate.toISOString());
    }
    onClose();
  };

  const handleCancelClick = () => {
    setShowDatePicker(false);
    setSelectedDate(new Date());
  };

  const getDayName = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  return (
    <div className={styles.optionPanel}>
      {!showDatePicker ? (
        <>
          {dueDateOptions.map(option => (
            <div key={option.value} className={styles.optionItem} onClick={() => handleDateOptionClick(option.value)}>
              <span>{option.label}</span>
              <span className={styles.dateDay}>
                {option.value === 'Today' && getDayName(new Date())}
                {option.value === 'Tomorrow' && getDayName(new Date(new Date().setDate(new Date().getDate() + 1)))}
                {option.value === 'Next week' && getDayName(new Date(new Date().setDate(new Date().getDate() + 7)))}
              </span>
            </div>
          ))}
          <div className={`${styles.optionItem} ${styles.customDateItem}`} onClick={() => setShowDatePicker(true)}>
            <span className="material-icons">calendar_today</span>
            <span>Pick a Date</span>
          </div>
        </>
      ) : (
        <>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="Pp"
            inline
            minDate={new Date()}
          />
          <div className={styles.datePickerActions}>
            <div className={styles.cancelButton} onClick={handleCancelClick}>Cancel</div>
            <div className={styles.saveButton} onClick={handleSaveClick}>Save</div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddDueDate;
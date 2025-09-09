import React, { useState, ChangeEvent, useEffect } from 'react';
import styles from '../components/Task/TaskDetails/TaskDetails.module.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface RemindMeProps {
  onSetReminder: (value: string | Date) => void;
  onClose: () => void;
}

interface CustomTimeInputProps {
  initialDate: Date | null;
  onTimeChange: (newDate: Date) => void;
}

const CustomTimeInput: React.FC<CustomTimeInputProps> = ({ initialDate, onTimeChange }) => {
  const [hour, setHour] = useState(initialDate ? initialDate.getHours() % 12 || 12 : 12);
  const [minute, setMinute] = useState(initialDate ? initialDate.getMinutes() : 0);
  const [ampm, setAmPm] = useState(initialDate && initialDate.getHours() >= 12 ? 'PM' : 'AM');

  useEffect(() => {
    if (initialDate) {
      setHour(initialDate.getHours() % 12 || 12);
      setMinute(initialDate.getMinutes());
      setAmPm(initialDate.getHours() >= 12 ? 'PM' : 'AM');
    }
  }, [initialDate]);

  const updateDateTime = (newHour = hour, newMinute = minute, newAmPm = ampm) => {
    const newDate = initialDate || new Date();
    let newFullHour = newHour;
    if (newAmPm === 'PM' && newFullHour < 12) {
      newFullHour += 12;
    }
    if (newAmPm === 'AM' && newFullHour === 12) {
      newFullHour = 0;
    }
    newDate.setHours(newFullHour, newMinute, 0);
    onTimeChange(newDate);
  };

  const handleHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newHour = parseInt(e.target.value, 10);
    if (!isNaN(newHour) && newHour >= 1 && newHour <= 12) {
      setHour(newHour);
      updateDateTime(newHour);
    }
  };

  const handleMinuteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newMinute = parseInt(e.target.value, 10);
    if (!isNaN(newMinute) && newMinute >= 0 && newMinute <= 59) {
      setMinute(newMinute);
      updateDateTime(undefined, newMinute);
    }
  };

  const handleAmPmClick = () => {
    const newAmPm = ampm === 'AM' ? 'PM' : 'AM';
    setAmPm(newAmPm);
    updateDateTime(undefined, undefined, newAmPm);
  };

  return (
    <div className={styles.customTimeInputContainer}>
      <input type="number" className={styles.timeInput} value={hour} onChange={handleHourChange} min="1" max="12" />
      <span className={styles.timeSeparator}>:</span>
      <input type="number" className={styles.timeInput} value={minute < 10 ? `0${minute}` : minute} onChange={handleMinuteChange} min="0" max="59" />
      <div className={styles.ampmButton} onClick={handleAmPmClick}>
        {ampm}
      </div>
    </div>
  );
};

const RemindMe: React.FC<RemindMeProps> = ({ onSetReminder, onClose }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const remindMeOptions = [
    { label: 'Later today', value: 'Today, 7:00 PM' },
    { label: 'Tomorrow', value: 'Tomorrow, 9:00 AM' },
    { label: 'Next week', value: 'Next week, 9:00 AM' },
  ];

  const handleOptionClick = (value: string) => {
    onSetReminder(value);
    onClose();
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSave = () => {
    if (selectedDate) {
      onSetReminder(selectedDate);
    }
    onClose();
  };

  const handleCancel = () => {
    setShowDatePicker(false);
    setSelectedDate(new Date());
  };

  return (
    <div className={styles.optionPanel}>
      {!showDatePicker ? (
        <>
          {remindMeOptions.map(option => (
            <div key={option.value} className={styles.optionItem} onClick={() => handleOptionClick(option.value)}>
              {option.label}
            </div>
          ))}
          <div className={styles.optionItem} onClick={() => setShowDatePicker(true)}>
            Pick a date & time
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
          <CustomTimeInput initialDate={selectedDate} onTimeChange={handleTimeChange} />
          <div className={styles.datePickerActions}>
            <div className={styles.cancelButton} onClick={handleCancel}>Cancel</div>
            <div className={styles.saveButton} onClick={handleSave}>Save</div>
          </div>
        </>
      )}
    </div>
  );
};

export default RemindMe;
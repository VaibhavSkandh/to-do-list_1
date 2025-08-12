import React, { useState, useEffect } from 'react';
import styles from './TaskDetails.module.scss';
import RemindMe from './functionalities_of_taskdetails/RemindMe';
import AddDueDate from './functionalities_of_taskdetails/AddDueDate';
import Repeat from './functionalities_of_taskdetails/Repeat';

interface TaskDetailsProps {
  onClose: () => void;
  taskTitle: string;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ onClose, taskTitle }) => {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [reminder, setReminder] = useState<Date | string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [repeat, setRepeat] = useState<string | null>(null);

  const handlePanelToggle = (panelName: string) => {
    setOpenPanel(openPanel === panelName ? null : panelName);
  };

  const handleSetReminder = (value: string | Date) => {
    setReminder(value);
    setOpenPanel(null);
  };
  
  const handleClearReminder = () => {
    setReminder(null);
  };

  const handleSetDueDate = (value: string | null) => {
    setDueDate(value);
    setOpenPanel(null);
  };

  const handleClearDueDate = () => {
    setDueDate(null);
  };

  const handleSetRepeat = (value: string) => {
    setRepeat(value);
    setOpenPanel(null);
  };

  const getDueDateDisplay = () => {
    if (!dueDate) return 'Add due date';

    // Check for preset options
    if (dueDate === 'Today') return 'Due: Today';
    if (dueDate === 'Tomorrow') return 'Due: Tomorrow';
    if (dueDate === 'Next week') return 'Due: Next week';

    try {
      const date = new Date(dueDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (date.toDateString() === today.toDateString()) return 'Due: Today';
      if (date.toDateString() === tomorrow.toDateString()) return 'Due: Tomorrow';

      return `Due: ${date.toLocaleDateString()}`;
    } catch (e) {
      return `Due: ${dueDate}`;
    }
  };

  // useEffect to handle the notification logic for reminders and due dates
  useEffect(() => {
    const handleNotification = (time: Date | null, title: string, type: 'reminder' | 'dueDate') => {
      if (!time) return;

      const now = new Date();
      const timeUntilNotification = time.getTime() - now.getTime();
      
      const isOverdue = timeUntilNotification < 0;
      const notificationTitle = isOverdue ? `${type === 'reminder' ? 'Reminder' : 'Due Date'} Overdue!` : `${type === 'reminder' ? 'Reminder' : 'Due Date'} Alert!`;
      const notificationBody = isOverdue 
        ? `The due date for your task "${title}" has passed.`
        : `Time to complete your task: "${title}". It's due on ${time.toLocaleString()}.`;

      if (timeUntilNotification > 0) {
        if ('Notification' in window && Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              const timer = setTimeout(() => {
                new Notification(notificationTitle, {
                  body: notificationBody,
                });
              }, timeUntilNotification);
              return () => clearTimeout(timer);
            } else {
              console.warn('Notification permission denied. Cannot schedule notification.');
            }
          });
        } else {
          console.warn('Notifications are not supported or permission is denied.');
        }
      } else if (isOverdue) {
        // Immediately show a notification if the due date is in the past
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notificationTitle, {
            body: notificationBody,
          });
        }
      }
    };

    handleNotification(reminder instanceof Date ? reminder : null, taskTitle, 'reminder');
    
    // Convert dueDate string to a Date object for notification logic
    let parsedDueDate: Date | null = null;
    if (dueDate) {
      if (dueDate === 'Today') parsedDueDate = new Date();
      else if (dueDate === 'Tomorrow') {
        parsedDueDate = new Date();
        parsedDueDate.setDate(parsedDueDate.getDate() + 1);
      }
      else if (dueDate === 'Next week') {
        parsedDueDate = new Date();
        parsedDueDate.setDate(parsedDueDate.getDate() + 7);
      }
      else {
        parsedDueDate = new Date(dueDate);
      }
    }
    handleNotification(parsedDueDate, taskTitle, 'dueDate');

  }, [reminder, dueDate, taskTitle]); 

  return (
    <aside className={styles.taskDetailsPanel}>
      <button onClick={onClose} className={styles.closeButton}>
        <span className="material-icons">close</span>
      </button>
      <div className={styles.taskHeaderSection}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <span className={styles.checkbox}></span>
            <h2 className={styles.taskTitle}>{taskTitle}</h2>
            <span className={`${styles.starIcon} material-icons`}>star_border</span>
          </div>
        </div>
        <div className={styles.addStepSection}>
          <span className={`${styles.addStepIcon} material-icons`}>add</span>
          <span className={styles.addStepText}>Add step</span>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.myDaySection}>
          <span className={`${styles.myDayIcon} material-icons`}>wb_sunny</span>
          <span className={styles.myDayText}>Added to My Day</span>
        </div>
        <div className={styles.actionSection}>
          <div className={`${styles.actionItem} ${openPanel === 'remindMe' ? styles.active : ''}`}>
            <div className={styles.actionItemHeader} onClick={() => handlePanelToggle('remindMe')}>
              <span className={`${styles.actionIcon} material-icons`}>schedule</span>
              <span className={styles.actionText}>Remind me</span>
              {reminder && <span className={styles.actionValue}>{reminder instanceof Date ? reminder.toLocaleString() : reminder}</span>}
              {reminder && (
                <button className={styles.clearDateButton} onClick={handleClearReminder}>
                  <span className="material-icons">close</span>
                </button>
              )}
            </div>
            {openPanel === 'remindMe' && (
              <RemindMe onSetReminder={handleSetReminder} onClose={() => setOpenPanel(null)} />
            )}
          </div>

          <div className={`${styles.actionItem} ${openPanel === 'addDueDate' ? styles.active : ''}`}>
            <div className={styles.actionItemHeader} onClick={() => handlePanelToggle('addDueDate')}>
              <span className={`${styles.actionIcon} material-icons`}>calendar_today</span>
              <span className={styles.actionText}>
                {getDueDateDisplay()}
              </span>
              {dueDate && (
                <button className={styles.clearDateButton} onClick={handleClearDueDate}>
                  <span className="material-icons">close</span>
                </button>
              )}
            </div>
            {openPanel === 'addDueDate' && (
              <AddDueDate onSetDueDate={handleSetDueDate} onClose={() => setOpenPanel(null)} />
            )}
          </div>

          <div className={`${styles.actionItem} ${openPanel === 'repeat' ? styles.active : ''}`}>
            <div className={styles.actionItemHeader} onClick={() => handlePanelToggle('repeat')}>
              <span className={`${styles.actionIcon} material-icons`}>repeat</span>
              <span className={styles.actionText}>
                {repeat ? `Repeat: ${repeat}` : 'Repeat'}
              </span>
            </div>
            {openPanel === 'repeat' && (
              <Repeat onSetRepeat={handleSetRepeat} onClose={() => setOpenPanel(null)} />
            )}
          </div>
        </div>
        <div className={styles.addFileSection}>
          <span className={`${styles.addFileIcon} material-icons`}>attach_file</span>
          <span className={styles.addFileText}>Add file</span>
        </div>
        <div className={styles.noteSection}>
          <textarea className={styles.noteInput} placeholder="Add note"></textarea>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.creationTime}>Created 21 minutes ago</div>
        <span className={`${styles.deleteIcon} material-icons`}>delete</span>
      </div>
    </aside>
  );
};

export default TaskDetails;
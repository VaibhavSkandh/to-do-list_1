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

  const handleSetDueDate = (value: string) => {
    setDueDate(value);
    setOpenPanel(null);
  };

  const handleSetRepeat = (value: string) => {
    setRepeat(value);
    setOpenPanel(null);
  };

  const getDueDateDisplay = () => {
    if (!dueDate) return 'Add due date';
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dueDate === 'Today') return 'Due: Today';
    if (dueDate === 'Tomorrow') return 'Due: Tomorrow';
    if (dueDate === 'Next week') return 'Due: Next week';

    return `Due: ${dueDate}`;
  };

  // useEffect to handle the notification logic
  useEffect(() => {
    if (reminder instanceof Date) {
      const now = new Date();
      const timeUntilReminder = reminder.getTime() - now.getTime();

      if (timeUntilReminder > 0) {
        if ('Notification' in window && Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              const timer = setTimeout(() => {
                new Notification('Reminder!', {
                  body: `Time to complete your task: ${taskTitle}`,
                });
              }, timeUntilReminder);

              // Cleanup function to clear the timer if the component unmounts
              // or the reminder is updated before the timer fires
              return () => clearTimeout(timer);
            } else {
              console.warn('Notification permission denied. Cannot schedule reminder.');
            }
          });
        } else {
          console.warn('Notifications are not supported or permission is denied.');
        }
      } else {
        console.warn('The reminder time is in the past, not scheduling notification.');
      }
    }
  }, [reminder, taskTitle]); // Rerun this effect when reminder or taskTitle changes

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
            </div>
            {openPanel === 'remindMe' && (
              <RemindMe onSetReminder={handleSetReminder} onClose={() => setOpenPanel(null)} />
            )}
          </div>

          <div className={`${styles.actionItem} ${openPanel === 'addDueDate' ? styles.active : ''}`}>
            <div className={styles.actionItemHeader} onClick={() => handlePanelToggle('addDueDate')}>
              <span className={`${styles.actionIcon} material-icons`}>calendar_today</span>
              <span className={styles.actionText}>{getDueDateDisplay()}</span>
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
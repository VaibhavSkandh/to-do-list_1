// src/Maincontent/Routed_files/TaskDetails.tsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from './useAuth'; // Correct import for the custom auth hook
import styles from './TaskDetails.module.scss';
import RemindMe from './functionalities_of_taskdetails/RemindMe';
import AddDueDate from './functionalities_of_taskdetails/AddDueDate';
import Repeat from './functionalities_of_taskdetails/Repeat';

interface TaskDetailsProps {
  onClose: () => void;
  onDelete: (id: string) => void;
  taskTitle: string;
  taskId: string;
  favorited: boolean;
  onFavoriteToggle: () => void;
  creationTime: Date;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ onClose, onDelete, taskTitle, taskId, favorited, onFavoriteToggle, creationTime }) => {
  const { user } = useAuth(); // Correctly get the user from your custom hook
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [reminder, setReminder] = useState<Date | string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [repeat, setRepeat] = useState<string | null>(null);
  const [files, setFiles] = useState<{ name: string; url: string; }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;

    const fetchFiles = async () => {
      try {
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        const taskSnap = await getDoc(taskRef);
        if (taskSnap.exists()) {
          const data = taskSnap.data();
          if (data.files) {
            setFiles(data.files);
          }
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, [user, taskId]);

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

  const handleClearRepeat = () => {
    setRepeat(null);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        const storageRef = ref(storage, `tasks/${taskId}/${file.name}`);
        
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        await updateDoc(taskRef, {
          files: arrayUnion({
            name: file.name,
            url: downloadURL,
          }),
        });
        setFiles(prevFiles => [...prevFiles, { name: file.name, url: downloadURL }]);
        alert('File uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('File upload failed. Check the console for details.');
      }
    }
  };

  const getDueDateDisplay = () => {
    if (!dueDate) return 'Add due date';
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

  const calculateNextDate = (startDate: Date, repeatPattern: string): Date | null => {
    let nextDate = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (nextDate.getTime() <= Date.now()) {
      switch (repeatPattern) {
        case 'Daily':
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'Weekdays':
          do {
            nextDate.setDate(nextDate.getDate() + 1);
          } while (nextDate.getDay() === 0 || nextDate.getDay() === 6);
          break;
        case 'Weekly':
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case 'Monthly':
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case 'Yearly':
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
        default:
          return null;
      }
    }
    return nextDate;
  };

  const effectDependencies = useMemo(() => [reminder, dueDate, taskTitle, repeat], [reminder, dueDate, taskTitle, repeat]);

  useEffect(() => {
    const activeTimers: number[] = [];

    const scheduleNotification = (time: Date, title: string, type: 'reminder' | 'dueDate') => {
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

                if (repeat && type === 'reminder') {
                  const nextReminderTime = calculateNextDate(time, repeat);
                  if (nextReminderTime) {
                    scheduleNotification(nextReminderTime, title, 'reminder');
                  }
                }
              }, timeUntilNotification);
              activeTimers.push(timer as unknown as number);
            } else {
              console.warn('Notification permission denied. Cannot schedule notification.');
            }
          });
        } else {
          console.warn('Notifications are not supported or permission is denied.');
        }
      } else if (isOverdue) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notificationTitle, {
            body: notificationBody,
          });
        }
      }
    };

    if (reminder instanceof Date) {
      scheduleNotification(reminder, taskTitle, 'reminder');
    }

    let parsedDueDate: Date | null = null;
    if (dueDate) {
      const now = new Date();
      if (dueDate === 'Today') parsedDueDate = now;
      else if (dueDate === 'Tomorrow') {
        parsedDueDate = new Date(now);
        parsedDueDate.setDate(now.getDate() + 1);
      }
      else if (dueDate === 'Next week') {
        parsedDueDate = new Date(now);
        parsedDueDate.setDate(now.getDate() + 7);
      }
      else {
        parsedDueDate = new Date(dueDate);
      }
    }
    if (parsedDueDate) {
      scheduleNotification(parsedDueDate, taskTitle, 'dueDate');
    }

    return () => {
      activeTimers.forEach(timer => clearTimeout(timer));
    };
  }, [effectDependencies]);

  const formatCreationTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Created just now';
    } else if (diffInMinutes < 60) {
      return `Created ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes < 1440) { // 60 * 24
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `Created ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `Created on ${date.toLocaleDateString()}`;
    }
  };

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
            <button
              className={styles.favoriteButton}
              onClick={onFavoriteToggle}
            >
              <span className={`${styles.starIcon} material-icons ${favorited ? styles.favorited : ''}`}>
                star
              </span>
            </button>
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
              {repeat && (
                <button className={styles.clearDateButton} onClick={handleClearRepeat}>
                  <span className="material-icons">close</span>
                </button>
              )}
            </div>
            {openPanel === 'repeat' && (
              <Repeat onSetRepeat={handleSetRepeat} onClose={() => setOpenPanel(null)} />
            )}
          </div>
        </div>

        <div className={styles.addFileSection}>
          <label htmlFor="file-upload" className={styles.addFileLabel}>
            <span className={`${styles.addFileIcon} material-icons`}>attach_file</span>
            <span className={styles.addFileText}>Add file</span>
          </label>
          <input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {files.length > 0 && (
          <div className={styles.uploadedFilesSection}>
            <h3 className={styles.uploadedFilesTitle}>Attached Files</h3>
            <ul className={styles.filesList}>
              {files.map((file, index) => (
                <li key={index} className={styles.fileItem}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className={styles.fileLink}>
                    <span className={`${styles.fileIcon} material-icons`}>insert_drive_file</span>
                    {file.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.noteSection}>
          <textarea className={styles.noteInput} placeholder="Add note"></textarea>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.creationTime}>{formatCreationTime(creationTime)}</div>
        <span className={`${styles.deleteIcon} material-icons`} onClick={() => onDelete(taskId)}>delete</span>
      </div>
    </aside>
  );
};

export default TaskDetails;
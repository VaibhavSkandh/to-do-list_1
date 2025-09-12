import React, { useState, useEffect, useMemo, useRef } from "react";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebase";
import { useAuth } from "../../../hooks/useAuth";
import styles from "./TaskDetails.module.scss";
import RemindMe from "../../../functionalities_of_taskdetails/RemindMe";
import AddDueDate from "../../../functionalities_of_taskdetails/AddDueDate";
import Repeat from "../../../functionalities_of_taskdetails/Repeat";
import { Task } from "../../../App";
import TaskHeader from "./Task_Header";
import TaskActionItem from "./Task_Action_Item";
import TaskAttachments from "./Task_Attachments";

export interface TaskDetailsProps {
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdateTask: (id: string, updatedFields: Partial<Task>) => Promise<void>;
  taskTitle: string;
  taskId: string;
  favorited: boolean;
  onFavoriteToggle: () => void;
  creationTime: Date;
}

const TaskDetailsPanel: React.FC<TaskDetailsProps> = ({
  onClose,
  onDelete,
  onUpdateTask,
  taskTitle,
  taskId,
  favorited,
  onFavoriteToggle,
  creationTime,
}) => {
  const { user } = useAuth();
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [reminder, setReminder] = useState<Date | string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [repeat, setRepeat] = useState<string | null>(null);
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);

  const localStorageKey = `taskDetails-${taskId}`;

  useEffect(() => {
    if (!user) return;

    const fetchFilesAndData = async () => {
      try {
        const taskRef = doc(db, "users", user.uid, "tasks", taskId);
        const taskSnap = await getDoc(taskRef);
        if (taskSnap.exists()) {
          const data = taskSnap.data();
          if (data.files) {
            setFiles(data.files);
          }
          if (data.reminder) {
            setReminder(data.reminder.toDate ? data.reminder.toDate() : data.reminder);
          }
          if (data.dueDate) {
            setDueDate(data.dueDate.toDate ? data.dueDate.toDate().toLocaleDateString() : data.dueDate);
          }
          if (data.repeat) {
            setRepeat(data.repeat);
          }
        }
      } catch (error) {
        console.error("Error fetching task details:", error);
      }
    };
    fetchFilesAndData();
  }, [user, taskId]);

  const handlePanelToggle = (panelName: string) => {
    setOpenPanel(openPanel === panelName ? null : panelName);
  };

  const handleSetReminder = (value: string | Date) => {
    setReminder(value);
    onUpdateTask(taskId, { reminder: value });
    setOpenPanel(null);
  };

  const handleClearReminder = () => {
    setReminder(null);
    onUpdateTask(taskId, { reminder: null });
  };

  const handleSetDueDate = (value: string | null) => {
    setDueDate(value);
    let dueDateValue: Date | undefined;
    if (value) {
      if (value === "Today") {
        dueDateValue = new Date();
      } else if (value === "Tomorrow") {
        dueDateValue = new Date();
        dueDateValue.setDate(dueDateValue.getDate() + 1);
      } else if (value === "Next week") {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        dueDateValue = nextWeek;
      } else {
        const parsed = new Date(value);
        dueDateValue = isNaN(parsed.getTime()) ? undefined : parsed;
      }
    } else {
      dueDateValue = undefined;
    }
    onUpdateTask(taskId, { dueDate: dueDateValue });
    setOpenPanel(null);
  };

  const handleClearDueDate = () => {
    setDueDate(null);
    onUpdateTask(taskId, { dueDate: null });
  };

  const handleSetRepeat = (value: string) => {
    setRepeat(value);
    onUpdateTask(taskId, { repeat: value });
    setOpenPanel(null);
  };

  const handleClearRepeat = () => {
    setRepeat(null);
    onUpdateTask(taskId, { repeat: null });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        const storageRef = ref(storage, `tasks/${taskId}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const taskRef = doc(db, "users", user.uid, "tasks", taskId);
        await updateDoc(taskRef, {
          files: arrayUnion({
            name: file.name,
            url: downloadURL,
          }),
        });
        setFiles((prevFiles) => [
          ...prevFiles,
          { name: file.name, url: downloadURL },
        ]);
        // Re-integrating the alert message logic with a custom approach
        console.log("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const getDueDateDisplay = () => {
    if (!dueDate) return "Add due date";
    if (dueDate === "Today") return "Due: Today";
    if (dueDate === "Tomorrow") return "Due: Tomorrow";
    if (dueDate === "Next week") return "Due: Next week";
    try {
      const date = new Date(dueDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (date.toDateString() === today.toDateString()) return "Due: Today";
      if (date.toDateString() === tomorrow.toDateString())
        return "Due: Tomorrow";
      return `Due: ${date.toLocaleDateString()}`;
    } catch (e) {
      return `Due: ${dueDate}`;
    }
  };

  const calculateNextDate = (
    startDate: Date,
    repeatPattern: string
  ): Date | null => {
    let nextDate = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    while (nextDate.getTime() <= Date.now()) {
      switch (repeatPattern) {
        case "Daily":
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case "Weekdays":
          do {
            nextDate.setDate(nextDate.getDate() + 1);
          } while (nextDate.getDay() === 0 || nextDate.getDay() === 6);
          break;
        case "Weekly":
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case "Monthly":
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case "Yearly":
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          break;
        default:
          return null;
      }
    }
    return nextDate;
  };

  const effectDependencies = useMemo(
    () => [reminder, dueDate, taskTitle, repeat],
    [reminder, dueDate, taskTitle, repeat]
  );

  useEffect(() => {
    const activeTimers: number[] = [];
    const scheduleNotification = (
      time: Date,
      title: string,
      type: "reminder" | "dueDate"
    ) => {
      const now = new Date();
      const timeUntilNotification = time.getTime() - now.getTime();
      const isOverdue = timeUntilNotification < 0;
      const notificationTitle = isOverdue
        ? `${type === "reminder" ? "Reminder" : "Due Date"} Overdue!`
        : `${type === "reminder" ? "Reminder" : "Due Date"} Alert!`;
      const notificationBody = isOverdue
        ? `The due date for your task "${title}" has passed.`
        : `Time to complete your task: "${title}". It's due on ${time.toLocaleString()}.`;
      if (timeUntilNotification > 0) {
        if ("Notification" in window && Notification.permission !== "denied") {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              const timer = setTimeout(() => {
                new Notification(notificationTitle, {
                  body: notificationBody,
                });
                if (repeat && type === "reminder") {
                  const nextReminderTime = calculateNextDate(time, repeat);
                  if (nextReminderTime) {
                    scheduleNotification(nextReminderTime, title, "reminder");
                  }
                }
              }, timeUntilNotification);
              activeTimers.push(timer as unknown as number);
            } else {
              console.warn(
                "Notification permission denied. Cannot schedule notification."
              );
            }
          });
        } else {
          console.warn(
            "Notifications are not supported or permission is denied."
          );
        }
      } else if (isOverdue) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(notificationTitle, {
            body: notificationBody,
          });
        }
      }
    };
    if (reminder instanceof Date) {
      scheduleNotification(reminder, taskTitle, "reminder");
    }
    let parsedDueDate: Date | null = null;
    if (dueDate) {
      const now = new Date();
      if (dueDate === "Today") parsedDueDate = now;
      else if (dueDate === "Tomorrow") {
        parsedDueDate = new Date(now);
        parsedDueDate.setDate(now.getDate() + 1);
      } else if (dueDate === "Next week") {
        parsedDueDate = new Date(now);
        parsedDueDate.setDate(now.getDate() + 7);
      } else {
        parsedDueDate = new Date(dueDate);
      }
    }
    if (parsedDueDate) {
      scheduleNotification(parsedDueDate, taskTitle, "dueDate");
    }
    return () => {
      activeTimers.forEach((timer) => clearTimeout(timer));
    };
  }, [effectDependencies]);

  const formatCreationTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );
    if (diffInMinutes < 1) {
      return "Created just now";
    } else if (diffInMinutes < 60) {
      return `Created ${diffInMinutes} minute${
        diffInMinutes > 1 ? "s" : ""
      } ago`;
    } else if (diffInMinutes < 1440) {
      // 60 * 24
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `Created ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return `Created on ${date.toLocaleDateString()}`;
    }
  };

  return (
    <aside className={styles.taskDetailsPanel}>
      <TaskHeader
        taskTitle={taskTitle}
        favorited={favorited}
        onFavoriteToggle={onFavoriteToggle}
        onClose={onClose}
        onAddStep={() => {}} // Placeholder for now
      />
      <div className={styles.content}>
        <div className={styles.myDaySection}>
          <span className={`${styles.myDayIcon} material-icons`}>wb_sunny</span>
          <span className={styles.myDayText}>Added to My Day</span>
        </div>
        <div className={styles.actionSection}>
          <TaskActionItem
            icon="schedule"
            label="Remind me"
            value={reminder instanceof Date ? reminder.toLocaleString() : reminder}
            isOpen={openPanel === "remindMe"}
            onToggle={() => handlePanelToggle("remindMe")}
            onClear={handleClearReminder}
          >
            <RemindMe
              onSetReminder={handleSetReminder}
              onClose={() => setOpenPanel(null)}
            />
          </TaskActionItem>
          <TaskActionItem
            icon="calendar_today"
            label={getDueDateDisplay()}
            isOpen={openPanel === "addDueDate"}
            onToggle={() => handlePanelToggle("addDueDate")}
            onClear={handleClearDueDate}
          >
            <AddDueDate
              onSetDueDate={handleSetDueDate}
              onClose={() => setOpenPanel(null)}
            />
          </TaskActionItem>
          <TaskActionItem
            icon="repeat"
            label="Repeat"
            value={repeat}
            isOpen={openPanel === "repeat"}
            onToggle={() => handlePanelToggle("repeat")}
            onClear={handleClearRepeat}
          >
            <Repeat
              onSetRepeat={handleSetRepeat}
              onClose={() => setOpenPanel(null)}
            />
          </TaskActionItem>
        </div>

        <TaskAttachments files={files} onFileChange={handleFileChange} />

        <div className={styles.noteSection}>
          <textarea
            className={styles.noteInput}
            placeholder="Add note"
          ></textarea>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.creationTime}>
          {formatCreationTime(creationTime)}
        </div>
        <span
          className={`${styles.deleteIcon} material-icons`}
          onClick={() => onDelete(taskId)}
        >
          delete
        </span>
      </div>
    </aside>
  );
};

export default TaskDetailsPanel;

// src/hooks/useTasks.ts
import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../../firebase';
import { Task } from '../../App';


export const useTasks = (user: User | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const tasksQuery = query(
      collection(db, `users/${user.uid}/tasks`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        completed: doc.data().completed,
        createdAt: doc.data().createdAt.toDate(),
        favorited: doc.data().favorited || false,
        dueDate: doc.data().dueDate?.toDate ? doc.data().dueDate.toDate() : undefined,
        reminder: doc.data().reminder?.toDate ? doc.data().reminder.toDate() : undefined,
      }));
      setTasks(fetchedTasks);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tasks: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTask = async (taskText: string) => {
    if (!user || !taskText.trim()) return;

    try {
      await addDoc(collection(db, `users/${user.uid}/tasks`), {
        text: taskText,
        completed: false,
        favorited: false,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/tasks`, id));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    if (!user) return;
    try {
      // Filter out any undefined or null values to prevent Firebase errors
      const validUpdates = Object.fromEntries(
        Object.entries(updatedFields).filter(([_, value]) => value !== undefined && value !== null)
      );

      await updateDoc(doc(db, `users/${user.uid}/tasks`, id), validUpdates);
    } catch (error) {
      console.error("Error updating task: ", error);
      throw error;
    }
  };

  return { tasks, loading, addTask, deleteTask, updateTask };
};
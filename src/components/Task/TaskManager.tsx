import React, { useState, useEffect } from 'react';
import PageLayout from '../PageLayout';
import TaskList from './TaskList';
import { Task } from '../../App';

const fetchTasks = async (page: number, limit: number) => {
  const allTasks: Task[] = Array.from({ length: 100 }, (_, i) => ({ 
    id: `${i}`, 
    text: `Task ${i + 1}`,
    completed: false,
    createdAt: new Date(),
    favorited: false,
    dueDate: null,
    reminder: null,
    repeat: null,
  }));

  const startIndex = (page - 1) * limit;
  const paginatedTasks = allTasks.slice(startIndex, startIndex + limit);

  return {
    tasks: paginatedTasks,
    totalTasks: allTasks.length,
  };
};

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const tasksPerPage = 10;

  useEffect(() => {
    const loadTasks = async () => {
      const { tasks, totalTasks } = await fetchTasks(currentPage, tasksPerPage);
      setTasks(tasks);
      setTotalTasks(totalTasks);
    };
    loadTasks();
  }, [currentPage]);

  const totalPages = Math.ceil(totalTasks / tasksPerPage);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleTaskSelect = (task: Task) => {
    console.log('Task selected:', task);
  };

  return (
    <PageLayout isMinimized={false}>
      <div>
        <h1>My Tasks</h1>
        <TaskList
          tasks={tasks}
          onTaskSelect={handleTaskSelect}
          pageName="My Day"
        />
        <div style={{ marginTop: '20px' }}>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span style={{ margin: '0 10px' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </PageLayout>
  );
};

export default TaskManager;
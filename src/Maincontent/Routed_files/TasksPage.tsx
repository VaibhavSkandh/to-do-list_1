import React from 'react';

// Define the shape of the Task object
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Update the prop interface to accept the full Task object
interface TasksPageProps {
  onTaskSelect: (task: Task) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ onTaskSelect }) => {
  return (
    <div>
      <h1>Tasks Page</h1>
      {/* Content for Tasks page goes here */}
    </div>
  );
};

export default TasksPage;
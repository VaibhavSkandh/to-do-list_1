import React from 'react';

// Define the shape of the Task object
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  favorited: boolean;
  dueDate?: Date;
}

// Update the prop interface to accept the full Task object and a list of tasks
interface ImportantPageProps {
  onTaskSelect: (task: Task) => void;
  tasks: Task[];
}

// Update the component to use the props interface and accept the prop
const ImportantPage: React.FC<ImportantPageProps> = ({ onTaskSelect, tasks }) => {
  return (
    <div>
      <h1>Important Page</h1>
      {tasks.length > 0 ? (
        tasks.map(task => (
          <div key={task.id} onClick={() => onTaskSelect(task)}>
            <p style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.text}
            </p>
          </div>
        ))
      ) : (
        <p>No important tasks.</p>
      )}
    </div>
  );
};

export default ImportantPage;
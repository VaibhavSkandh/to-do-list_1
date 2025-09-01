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

// Update the prop interface to accept the full Task object
interface ImportantPageProps {
  onTaskSelect: (task: Task) => void;
}

// Update the component to use the props interface and accept the prop
const ImportantPage: React.FC<ImportantPageProps> = ({ onTaskSelect }) => {
  return (
    <div>
      <h1>Important Page</h1>
      {/* The onTaskSelect prop can now be used here */}
    </div>
  );
};

export default ImportantPage;
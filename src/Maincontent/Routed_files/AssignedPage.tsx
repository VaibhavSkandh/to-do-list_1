import React from 'react';

// Define the shape of the Task object
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Update the prop interface to accept the full Task object
interface AssignedPageProps {
  onTaskSelect: (task: Task) => void;
}

// Update the component to use the props interface and accept the prop
const AssignedPage: React.FC<AssignedPageProps> = ({ onTaskSelect }) => {
  return (
    <div>
      <h1>Assigned to me Page</h1>
      {/* Content for Assigned to me page goes here */}
    </div>
  );
};

export default AssignedPage;
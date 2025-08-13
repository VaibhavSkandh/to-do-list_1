import React from 'react';

// Define the shape of the Task object
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// Update the prop interface to accept the full Task object
interface PlannedPageProps {
  onTaskSelect: (task: Task) => void;
}

// Update the component to use the props interface and accept the prop
const PlannedPage: React.FC<PlannedPageProps> = ({ onTaskSelect }) => {
  return (
    <div>
      <h1>Planned Page</h1>
      {/* Content for Planned page goes here */}
    </div>
  );
};

export default PlannedPage;
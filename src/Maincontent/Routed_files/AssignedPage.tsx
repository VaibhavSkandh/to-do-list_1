import React from 'react';

// Define the prop interface
interface AssignedPageProps {
  onTaskSelect: (task: { id: string; title: string }) => void;
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
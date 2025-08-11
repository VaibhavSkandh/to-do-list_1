import React from 'react';

// Define the prop interface
interface PlannedPageProps {
  onTaskSelect: (task: { id: string; title: string }) => void;
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
import React from 'react';

// Define the prop interface
interface ImportantPageProps {
  onTaskSelect: (task: { id: string; title: string }) => void;
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
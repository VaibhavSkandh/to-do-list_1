import React from 'react';
interface TasksPageProps {
  onTaskSelect: (task: { id: string; title: string }) => void;
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
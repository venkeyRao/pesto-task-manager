// src/components/TaskTable.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const STATUS_LABELS = {
  ALL: "All Tasks",
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const TaskTable = ({ tasks, loading, onDeleteClick }) => {
  return (
    <div className="table-card animated fadeInDown">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="5" className="text-center">Loading...</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{STATUS_LABELS[task.status]}</td>
                <td>
                  <Link className="btn-edit" to={`/tasks/${task.id}`}>Edit</Link>
                  <button className="btn-delete" onClick={() => onDeleteClick(task)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default TaskTable;

import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import "../css/default.css";

const STATUS_LABELS = {
  ALL: "All Tasks",
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTasks();
  }, [statusFilter]);

  const onDeleteClick = task => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    setLoading(true);
    axiosClient.delete(`/task/${task.id}`)
      .then(() => {
        getTasks();
      })
      .finally(() => setLoading(false));
  };

  const getTasks = (status = statusFilter) => {
    setLoading(true);
    const url = `/task${status ? `?status=${status}` : ''}`;
    axiosClient.get(url)
      .then(({ data }) => {
        setTasks(data.data);
      })
      .finally(() => setLoading(false));
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  return (
    <div className="dashboard-container">
       <div className="header">
        <h1>Tasks</h1>
        <div>
          <Link className="btn-add" to="/tasks/new">Add New Task</Link>
          <select className="status-filter" onChange={handleStatusChange} value={statusFilter}>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value === 'ALL' ? '' : value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
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
    </div>
  );
}

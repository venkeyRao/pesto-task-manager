import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import "../css/dashboard.css";
import TaskTable from "../components/TaskTable";

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
      <header className="page-header">
        <div className="header-left">
          <h4>Tasks</h4>
        </div>
        <div className="header-right">
          <Link className="btn-add" to="/tasks/new">Add New Task</Link>
          <select className="status-filter" onChange={handleStatusChange} value={statusFilter}>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value === 'ALL' ? '' : value}>{label}</option>
            ))}
          </select>
        </div>
      </header>
      <TaskTable tasks={tasks} loading={loading} onDeleteClick={onDeleteClick} />
    </div>
  );
}

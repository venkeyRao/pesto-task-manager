import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import "../css/taskForm.css";

const TASK_STATUSES = {
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/task/${id}`)
        .then(({ data }) => {
          setTask(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setErrors({ fetch: 'Failed to load task' });
        });
    }
  }, [id]);

  const validateForm = () => {
    let tempErrors = {};
    if (!task.title.trim()) tempErrors.title = "Title is required.";
    if (!task.description.trim()) tempErrors.description = "Description is required.";
    if (!task.status) tempErrors.status = "Status is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const onSubmit = ev => {
    ev.preventDefault();
    if (!validateForm()) return; 
    const method = id ? 'patch' : 'post';
    const url = id ? `/task/${id}` : '/task';

    axiosClient[method](url, task)
      .then(() => {
        navigate('/');
      })
      .catch(err => {
        const response = err.response;
        if (response && response.data && response.data.errors) {
          setErrors(response.data.errors);
        } else {
          setErrors({ save: 'An error occurred. Please try again.' });
        }
      });
  };

  return (
    <div className="card animated fadeInDown">
      <h3>{id ? `Update Task` : "New Task"}</h3>
      {loading && <div className="text-center">Loading...</div>}
      {errors.fetch && <div className="alert">{errors.fetch}</div>}
      {!loading && (
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={task.title}
              onChange={ev => setTask({ ...task, title: ev.target.value })}
              placeholder="Title"
            />
            {errors.title && <div className="alert">{errors.title}</div>}
          </div>
          <div className="input-group">
            <textarea
              value={task.description}
              onChange={ev => setTask({ ...task, description: ev.target.value })}
              placeholder="Description"
              maxLength="250"
            />
            {errors.description && <div className="alert">{errors.description}</div>}
          </div>
          <div className="input-group">
            <select
              className="status-filter"
              value={task.status}
              onChange={ev => setTask({ ...task, status: ev.target.value })}
            >
              <option value="">Select Status</option>
              {Object.entries(TASK_STATUSES).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
            {errors.status && <div className="alert">{errors.status}</div>}
          </div>
          <button type="submit" className="task-btn btn-save">Save</button>
          <Link className="task-btn btn-cancel" to="/">Cancel</Link>
        </form>
      )}
    </div>
  );
}

import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Box, Button, CircularProgress, TextField, Typography, MenuItem, Select, FormControl, InputLabel, Alert } from '@mui/material';

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
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2, boxShadow: 1, borderRadius: 1, backgroundColor: '#ffffff' }}>
      <Typography variant="h4" component="h1" sx={{ marginBottom: 2 }}>
        {id ? `Update Task` : "New Task"}
      </Typography>
      {loading && <Box sx={{ textAlign: 'center' }}><CircularProgress /></Box>}
      {errors.fetch && <Alert severity="error">{errors.fetch}</Alert>}
      {!loading && (
        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={task.title}
            onChange={ev => setTask({ ...task, title: ev.target.value })}
            margin="normal"
            required
            error={!!errors.title}
            helperText={errors.title}
          />
          <TextField
            fullWidth
            label="Description"
            value={task.description}
            onChange={ev => setTask({ ...task, description: ev.target.value })}
            margin="normal"
            required
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={4}
          />
          <FormControl fullWidth margin="normal" required error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select
              value={task.status}
              onChange={ev => setTask({ ...task, status: ev.target.value })}
              label="Status"
            >
              <MenuItem value="">Select Status</MenuItem>
              {Object.entries(TASK_STATUSES).map(([key, value]) => (
                <MenuItem key={key} value={key}>{value}</MenuItem>
              ))}
            </Select>
            {errors.status && <Typography variant="body2" color="error">{errors.status}</Typography>}
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button type="submit" variant="contained" color="primary">Save</Button>
            <Button component={Link} to="/" variant="outlined">Cancel</Button>
          </Box>
        </form>
      )}
    </Box>
  );
}

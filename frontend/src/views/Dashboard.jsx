import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import TaskTable from "../components/TaskTable";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

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
  const [open, setOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    getTasks();
  }, [statusFilter]);

  const handleDeleteClick = task => {
    setTaskToDelete(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTaskToDelete(null);
  };

  const handleConfirmDelete = () => {
    setLoading(true);
    axiosClient.delete(`/task/${taskToDelete.id}`)
      .then(() => {
        getTasks();
      })
      .finally(() => {
        setLoading(false);
        handleClose();
      });
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
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h4">Tasks</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button component={Link} to="/tasks/new" variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Add New Task
          </Button>
          <FormControl variant="outlined" size="medium" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={handleStatusChange} label="Status">
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value === 'ALL' ? '' : value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <TaskTable tasks={tasks} loading={loading} onDeleteClick={handleDeleteClick} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

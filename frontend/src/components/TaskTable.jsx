import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const STATUS_LABELS = {
  ALL: "All Tasks",
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const TaskTable = ({ tasks, loading, onDeleteClick }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center' }}>Loading...</TableCell>
            </TableRow>
          ) : (
            tasks.map(task => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{STATUS_LABELS[task.status]}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/tasks/${task.id}`} variant="contained" color="primary" size="small" sx={{ marginRight: 1 }}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" size="small" onClick={() => onDeleteClick(task)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;

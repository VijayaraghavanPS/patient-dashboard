import React from 'react';
import { Paper, Typography } from '@mui/material';

function Notifications({ notifications }) {
  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h5">Notifications</Typography>
      <ul>
        {notifications.map((notification, index) => (
          <li className="notification" key={index}>{notification}</li>
        ))}
      </ul>
    </Paper>
  );
}

export default Notifications;

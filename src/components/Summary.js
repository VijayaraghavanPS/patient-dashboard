import React from 'react';
import { Paper, Typography } from '@mui/material';

function Summary({ title, items, renderItem }) {
  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
      <Typography variant="h5">{title}</Typography>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{renderItem(item)}</li>
        ))}
      </ul>
    </Paper>
  );
}

export default Summary;

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function Header({ patient }) {
  return (
    <header className="App-header">
      <Typography variant="h1">Patient Health Dashboard</Typography>
      {patient && (
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">Name: {patient.name[0].given.join(' ')} {patient.name[0].family}</Typography>
            <Typography variant="body1">Address: {patient.address[0].line.join(' ')}, {patient.address[0].city}, {patient.address[0].state}, {patient.address[0].postalCode}</Typography>
          </CardContent>
        </Card>
      )}
    </header>
  );
}

export default Header;

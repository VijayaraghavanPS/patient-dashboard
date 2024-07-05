import React, { useState } from 'react';
import { Grid, Paper, Typography, FormControl, InputLabel, Select, MenuItem, CardContent } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Trends({ availableLabResults, availableVitalSigns, labResults, vitalSigns }) {
  const [selectedLabResult, setSelectedLabResult] = useState('');
  const [selectedVitalSign, setSelectedVitalSign] = useState('');

  const handleLabResultChange = (event) => {
    setSelectedLabResult(event.target.value);
  };

  const handleVitalSignChange = (event) => {
    setSelectedVitalSign(event.target.value);
  };

  const renderChart = (data, label, selectedCode) => {
    const chartData = data.filter(d => d.resource.code.coding[0].code === selectedCode).map(d => ({
      date: new Date(d.resource.effectiveDateTime).toLocaleDateString(),
      value: d.resource.valueQuantity?.value || null,
    }));

    const isEmpty = chartData.every(d => d.value === null);

    return (
      <Paper elevation={3} className="chart-container">
        <CardContent>
          <Line
            data={{
              labels: chartData.map(d => d.date),
              datasets: [{
                label,
                data: chartData.map(d => d.value),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
                pointBackgroundColor: chartData.map(d => d.value ? 'rgba(75,192,192,1)' : 'transparent'),
                pointBorderColor: chartData.map(d => d.value ? 'rgba(75,192,192,1)' : 'transparent')
              }]
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  suggestedMin: 0,
                  suggestedMax: isEmpty ? 1 : undefined,
                }
              },
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: `${label} Trends` }
              }
            }}
          />
        </CardContent>
      </Paper>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
          <Typography variant="h5">Lab Result Trends</Typography>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Select a lab result</InputLabel>
            <Select value={selectedLabResult} onChange={handleLabResultChange}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Object.entries(availableLabResults).map(([code, display]) => (
                <MenuItem key={code} value={code}>{display}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedLabResult && renderChart(labResults, availableLabResults[selectedLabResult], selectedLabResult)}
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 3 }}>
          <Typography variant="h5">Vital Signs Trends</Typography>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Select a vital sign</InputLabel>
            <Select value={selectedVitalSign} onChange={handleVitalSignChange}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Object.entries(availableVitalSigns).map(([code, display]) => (
                <MenuItem key={code} value={code}>{display}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedVitalSign && renderChart(vitalSigns, availableVitalSigns[selectedVitalSign], selectedVitalSign)}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Trends;

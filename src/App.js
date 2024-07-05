import React, { useEffect, useState } from 'react';
import FHIR from 'fhirclient';
import { Container, AppBar, Tabs, Tab, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './components/Header';
import TabPanel from './components/TabPanel';
import Summary from './components/Summary';
import Trends from './components/Trends';
import Notifications from './components/Notifications';
import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff4081' },
    background: { default: '#f0f2f5' },
  },
  typography: {
    h1: { fontSize: '2.5rem', fontWeight: 700, marginBottom: '20px' },
    h2: { fontSize: '1.8rem', fontWeight: 600, marginBottom: '10px' },
    body1: { fontSize: '1rem', marginBottom: '5px' },
  },
});

function App() {
  const [patient, setPatient] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [vitalSigns, setVitalSigns] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [availableLabResults, setAvailableLabResults] = useState([]);
  const [availableVitalSigns, setAvailableVitalSigns] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    FHIR.oauth2.ready()
      .then(client => {
        const patientId = client.patient.id;
        return Promise.all([
          client.request(`Patient/${patientId}`),
          client.request(`AllergyIntolerance?patient=${patientId}`),
          client.request(`MedicationRequest?patient=${patientId}`),
          client.request(`Condition?patient=${patientId}`),
          client.request(`Observation?patient=${patientId}&category=laboratory`),
          client.request(`Observation?patient=${patientId}&category=vital-signs`),
          client.request(`Appointment?patient=${patientId}`)
        ]);
      })
      .then(([patient, allergies, medications, conditions, labResults, vitalSigns, appointments]) => {
        setPatient(patient);
        setAllergies(allergies.entry || []);
        setMedications(medications.entry || []);
        setConditions(conditions.entry || []);
        setLabResults(labResults.entry || []);
        setVitalSigns(vitalSigns.entry || []);
        setAppointments(appointments.entry || []);
        setNotifications(createNotifications(appointments.entry || [], medications.entry || []));
        setAvailableLabResults(getUniqueObservations(labResults.entry || []));
        setAvailableVitalSigns(getUniqueObservations(vitalSigns.entry || []));
      })
      .catch(console.error);
  }, []);

  const createNotifications = (appointments, medications) => {
    const notifications = [];

    appointments.forEach(appt => {
      notifications.push(`Upcoming appointment on ${new Date(appt.resource.start).toLocaleString()}`);
    });

    medications.forEach(med => {
      notifications.push(`Medication refill needed for ${med.resource.medicationCodeableConcept.text}`);
    });

    return notifications;
  };

  const getUniqueObservations = (observations) => {
    const uniqueResults = {};
    observations.forEach(result => {
      const code = result.resource.code.coding[0].code;
      const display = result.resource.code.coding[0].display;
      uniqueResults[code] = display;
    });
    return uniqueResults;
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const getLatestLabResults = (labResults) => {
    const latestResults = {};

    labResults.forEach(result => {
      const code = result.resource.code.coding[0].code;
      const effectiveDate = new Date(result.resource.effectiveDateTime);

      if (!latestResults[code] || effectiveDate > latestResults[code].effectiveDate) {
        latestResults[code] = {
          effectiveDate,
          text: result.resource.code.text,
          value: result.resource.valueQuantity?.value,
          unit: result.resource.valueQuantity?.unit,
        };
      }
    });

    return Object.values(latestResults);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh', paddingTop: 3 }}>
        <Container>
          <Header patient={patient} />
          <AppBar position="static">
            <Tabs value={tabIndex} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary">
              <Tab label="Medications" />
              <Tab label="Allergies" />
              <Tab label="Conditions" />
              <Tab label="Lab Results" />
              <Tab label="Trends" />
              <Tab label="Notifications" />
            </Tabs>
          </AppBar>
          <TabPanel value={tabIndex} index={0}>
            <Summary title="Medications" items={medications} renderItem={item => item.resource.medicationCodeableConcept.text} />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <Summary title="Allergies" items={allergies} renderItem={item => item.resource.code.text} />
          </TabPanel>
          <TabPanel value={tabIndex} index={2}>
            <Summary title="Conditions" items={conditions} renderItem={item => item.resource.code.text} />
          </TabPanel>
          <TabPanel value={tabIndex} index={3}>
            <Summary
              title="Lab Results"
              items={getLatestLabResults(labResults)}
              renderItem={item => `${item.text}: ${item.value ? item.value + ' ' + item.unit : 'N/A'}`}
            />
          </TabPanel>
          <TabPanel value={tabIndex} index={4}>
            <Trends 
              availableLabResults={availableLabResults} 
              availableVitalSigns={availableVitalSigns} 
              labResults={labResults} 
              vitalSigns={vitalSigns} 
            />
          </TabPanel>
          <TabPanel value={tabIndex} index={5}>
            <Notifications notifications={notifications} />
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

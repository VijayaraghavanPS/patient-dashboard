import React from 'react';
import ReactDOM from 'react-dom';
import FHIR from 'fhirclient';
import App from './App';

FHIR.oauth2
  .init({
    clientId: '83a14ce3-566d-40da-84c0-a7c013da6de6',
    scope: 'launch/patient openid fhirUser patient/*.read',
    //scope: 'openid profile patient/AllergyIntolerance.read patient/Condition.read patient/Observation.read patient/MedicationRequest.read launch/patient offline_access',
    //iss: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
    iss: 'https://launch.smarthealthit.org/v/r4/sim/WzMsIiIsIiIsIkFVVE8iLDAsMCwwLCIiLCIiLCIiLCIiLCIiLCIiLCIiLDAsMV0/fhir',
  })
  .then(() => {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );
  })
  .catch((error) => {
    console.error(error);
  });
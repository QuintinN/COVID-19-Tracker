import React, {useEffect, useState } from "react";
import {
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import './App.css';

function App() {
  const [countries, setCountries] = useState([
    'USA', 'UK', 'INDIA'
  ]); 

  // STATE = how to write a variable in REACT 

  // https://disease.sh/v3/covid-19/countries
  // ^^ API Call 

  // USEEFFECT = Runs a piece of code 
  // based on a given condition 

  useEffect(() => {
    // The code in here will run once 
    // when the app/component and not again
    
    // async -> send a request to server, wait, do something with info 
    
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country, // United States, United Kingdom
            value: country.countryInfo.iso2 // UK, USA, FR 
          }));

          set
      });
    };
  }, []);

  return (
    <div className="app">    
      <div className="app__header">
      <h1>COVID-19 TRACKER</h1>
        <FormControl className="app_dropdown">
          <Select
            variant="outlined"
            value="abc"
          >
            {/* Loop through all the countries and show a drop 
            down list of the countries*/}

            {
              countries.map(country => (
                <MenuItem value={country}>{country}</MenuItem>
              ))
            }

            {/*<MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">A</MenuItem>
            <MenuItem value="worldwide">B</MenuItem>
            <MenuItem value="worldwide">C</MenuItem>*/}
            
          </Select>
        </FormControl>
      </div>

      { /* Header */}
      { /* Title + select input dropdown field */}

      { /* InfoBoxs */}
      { /* InfoBoxs */}
      { /* InfoBoxs */}

      {/* Table */}
      {/* Graph */}
      
      {/* Map */}

    </div>
  );
}

export default App;

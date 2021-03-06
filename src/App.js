import React, {useEffect, useState } from "react";
import { MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core";
import './App.css';
import Infobox from "./Infobox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import numeral from "numeral";

function App() {
  const [countries, setCountries] = useState([]); 
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3); 
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  // https://disease.sh/v3/covid-19/countries
  useEffect(() => {    
    const getCountriesData = async () => {
      fetch ("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,  // United States, United Kingdom
            value: country.countryInfo.iso2, // UK, USA, FR 
          }));
          let sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value; 
    const url = 
      countryCode === "worldwide" 
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url) 
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode); 
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">    
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select 
            variant="outlined" 
            value = {country}
            onChange={onCountryChange} 
           >
              {/* Loop through all the countries and show a drop 
              down list of the countries*/}
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
        </FormControl>
      </div>
      <div className="app__stats">
        <Infobox title="Coronavirus Cases" 
        onClick={(event) => setCasesType("cases")}
        title="Coronavirus Cases"
        isRed
        active={casesType === "cases"}
        cases={prettyPrintStat(countryInfo.todayCases)}
        total={numeral(countryInfo.cases).format("0.0a")}
      />

        <Infobox title="Recovered" 
        onClick={(event) => setCasesType("recovered")}
        title="Recovered"
        active={casesType === "recovered"}
        cases={prettyPrintStat(countryInfo.todayRecovered)}
        total={numeral(countryInfo.recovered).format("0.0a")}
      />
        <Infobox title="Deaths" 
        onClick={(event) => setCasesType("deaths")}
        title="Deaths"
        isRed
        active={casesType === "deaths"}
        cases={prettyPrintStat(countryInfo.todayDeaths)}
        total={numeral(countryInfo.deaths).format("0.0a")}
        />
      </div>
      <Map 
       countries={mapCountries} 
       casesType={casesType}
       center={mapCenter}
       zoom={mapZoom}
      />
      </div>
      <Card className="app__right">
      <CardContent>
        <div className="app_information">
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </div>
      </CardContent>
      </Card>
    </div>
  );
}

export default App;

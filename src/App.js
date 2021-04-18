import React, {useState, useEffect} from "react";
import {MenuItem, FormControl, Select, Card, CardContent,} from "@material-ui/core";
import './App.css';
import Infobox from "./Infobox";
import Map from "./Map";
import Table from "./Table";
import {sortData, prettyPrintStat} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import "./Infobox.css";


function App() {

   const [countries, setCountries] = useState([]);
   const [country, setcountry] = useState(["worldwide"]);
   const [countryInfo, setcountryInfo] = useState({});
   const [tableData, setTableData] = useState([]);
   const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
   const [mapZoom, setMapZoom] = useState(3);
   const [mapCountries, setMapCountries] = useState([]);
   const [casesType, setCasesType] = useState("cases");
   const [isLoading, setLoading] = useState(false);

    useEffect(() => {
      fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setcountryInfo(data);
      });
    }, []); 

    useEffect(() =>{
          // async --> send a request, wait for it, do something with it.

          const getCountriesData = async() => {
            await fetch("https://disease.sh/v3/covid-19/countries")
            .then((response) => response.json())
            .then((data) => {
              const countries = data.map((country) => (
                {
                  name: country.country,
                  value: country.countryInfo.iso2,
                }));
                

                const sortedData = sortData(data);
                setMapCountries(data);
                setTableData(sortedData);
                setCountries(countries);
            });
          };

          getCountriesData();
    }, [countries]);

    const onCountryChange = async (event) => {
      setLoading(true);
      const countryCode = event.target.value;
      setcountry(countryCode);
       const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`

       await fetch(url)
       .then(response => response.json())
       .then(data => {
          setcountry(countryCode);
          // all of the country data ...
          setcountryInfo(data);
          setLoading(false);
          // console.log(data);
          // setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          countryCode === "worldwide"
              ? setMapCenter([34.80746, -40.4796])
              : setMapCenter([data.countryInfo.lat, data.countryInfo.long]); 
          setMapZoom(3);
       });

      //  console.log(mapCenter);

      //  https://disease.sh/v3/covid-19/all
      //  https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

    };


  //  https://disease.sh/v3/covid-19/countries
  return (
    <div className="app">
      <div className="app__left">
        {/* header */}
         {/* title and dropdown */}
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select varient="outlined" onChange={onCountryChange} value={country} >
            {/* loop through all the countries and show a drop down list  */}
             <MenuItem value="worldwide">Worldwide</MenuItem>
            {
              countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }

              {/* <MenuItem value="worldwide">Worldwide</MenuItem>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              <MenuItem value="worldwide">Worldwide</MenuItem> */}
          </Select>
        </FormControl>
      </div>
      {/* infoboxes */}
      <div className="app__stats">
        <Infobox className="infobox__cases" isLoading={isLoading} isRed active={casesType === "cases"} onClick={e => setCasesType("cases")} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
        <Infobox className="infobox__recovered" isLoading={isLoading} active={casesType === "recovered"} onClick={e => setCasesType("recovered")} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
        <Infobox className="infobox__deaths" isLoading={isLoading} isRed active={casesType === "deaths"} onClick={e => setCasesType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
      </div>
      {/* map */}
      <Map 
        countries={mapCountries}
        center={mapCenter}
        zoom={mapZoom}
        casesType={casesType}
      />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
           {/* table */}
           <Table countries={tableData}/>
           <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
           {/* graph */}
           <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
         
      </Card>
         
    </div>
  );
}

export default App;

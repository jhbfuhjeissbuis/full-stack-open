import { useState, useEffect } from "react";
import service from "./services/countries";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailedCountry, setDetailedCountry] = useState(null);
  useEffect(() => {
    service.getAll().then((initialCountries) => {
      setCountries(initialCountries);
    });
  }, []);

  return (
    <div>
      <h2>{`Countries`}</h2>
      <p>
        find countries{" "}
        <Filter
          filter={filter}
          setFilter={setFilter}
          setDetailedCountry={setDetailedCountry}
          detailedCountry={detailedCountry}
          countries={countries}
        />
      </p>
      <Countries
        countries={countries}
        filter={filter}
        detailedCountry={detailedCountry}
        setDetailedCountry={setDetailedCountry}
      />
    </div>
  );
}

function Filter({
  filter,
  setFilter,
  setDetailedCountry,
  detailedCountry,
  countries,
}) {
  return (
    <input
      value={filter}
      onChange={(e) => {
        const newFilter = e.target.value;
        setFilter(newFilter);

        if (detailedCountry) {
          const stillInList = countries.some(
            (country) =>
              country.name.common
                .toLowerCase()
                .includes(newFilter.toLowerCase()) &&
              country.name.common === detailedCountry.name.common
          );
          if (!stillInList) {
            setDetailedCountry(null);
          }
        }
      }}
    />
  );
}

function Countries({ countries, filter, detailedCountry, setDetailedCountry }) {
  const [requestedCountry, setRequestedCountry] = useState(null);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  );

  if (filter.trim() === "") return <div>Type to search for countries</div>;

  if (filteredCountries.length === 0) return <div>No matches found</div>;
  if (filteredCountries.length > 10)
    return <div>Too many matches, specify another filter</div>;
  if (filteredCountries.length === 1) {
    const countryName = filteredCountries[0].name.common;

    if (requestedCountry !== countryName) {
      setRequestedCountry(countryName);
      service.getByName(countryName).then((data) => {
        setDetailedCountry(data);
      });
    }

    if (detailedCountry) {
      return <CountryDetails country={detailedCountry} />;
    }
    return <div>Loading country details...</div>;
  }

  return (
    <div>
      <div>
        {filteredCountries.map((country) => (
          <div key={country.cca3 || country.name.common}>
            {country.name.common}
            <button
              onClick={() => {
                setRequestedCountry(country.name.common);
                service.getByName(country.name.common).then((data) => {
                  setDetailedCountry(data);
                });
              }}
            >
              show
            </button>
          </div>
        ))}
      </div>{" "}
      {detailedCountry ? (
        <CountryDetails country={detailedCountry} />
      ) : (
        <div>Loading country details...</div>
      )}
    </div>
  );
}

function CountryDetails({ country }) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (country.capital && country.capital[0]) {
      service.getWeather(country.capital[0]).then((weatherData) => {
        setWeather(weatherData);
      });
    }
  }, [country.capital]);

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital && country.capital.join(", ")}</p>
      <p>Area: {country.area} km^2</p>
      <h3>Languages:</h3>
      <ul>
        {country.languages &&
          Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
      </ul>
      <img
        src={country.flags && country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="200"
      />
      {country.capital && country.capital[0] && (
        <>
          <h3>Weather in {country.capital[0]}</h3>
          {weather ? (
            <div>
              <p>
                Temperature: {(weather.main.temp - 273.15).toFixed(2)} Celsius
              </p>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          ) : (
            <p>Loading weather...</p>
          )}
        </>
      )}
    </div>
  );
}

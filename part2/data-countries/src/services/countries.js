import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const getAll = () => {
  const request = axios.get(`${baseUrl}/all`);
  return request.then((response) => response.data);
};

const getByName = (name) => {
  const request = axios.get(`${baseUrl}/name/${name}`);
  return request.then((response) => response.data);
};

const getWeather = (capital) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}`;
  const request = axios.get(weatherUrl);
  return request.then((response) => response.data);
};

export default {
  getAll,
  getByName,
  getWeather,
};

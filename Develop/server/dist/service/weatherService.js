import dotenv from 'dotenv';
//import { dot } from 'node:test/reporters';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(city, date, icon, iconDescription, tempF, windSpeed, humidity) {
        this.city = city;
        this.date = date;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.tempF = tempF;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        // TODO: Define the baseURL, API key, and city name properties
        this.baseUrl = process.env.API_BASE_URL;
        this.apiKey = process.env.API_KEY;
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        try {
            const response = await fetch(query);
            const data = await response.json();
            console.log('Location Data:', data);
            return data;
        }
        catch (error) {
            console.error('Error fetching location data:', error);
            return null;
        }
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        return {
            lat: locationData.lat,
            lon: locationData.lon,
        };
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery() {
        return `${this.baseUrl}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `${this.baseUrl}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
        if (Array.isArray(locationData) && locationData.length > 0) {
            return this.destructureLocationData(locationData[0]); // Pass the first location object
        }
        else {
            console.error('No location data found');
            return null; // Return null if no data
        }
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const response = await fetch(this.buildWeatherQuery(coordinates));
        const data = await response.json();
        return data;
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const city = this.cityName;
        const date = new Date(response.list[0].dt * 1000).toLocaleDateString();
        const icon = response.list[0].weather[0].icon;
        const iconDescription = response.list[0].weather[0].description;
        const tempF = ((response.list[0].main.temp - 273.15) * 9) / 5 + 32;
        const windSpeed = response.list[0].wind.speed;
        const humidity = response.list[0].main.humidity;
        return new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity);
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        const forecastArray = [];
        forecastArray.push(currentWeather);
        for (let i = 1; i < weatherData.length; i++) {
            const city = this.cityName;
            const date = new Date(weatherData[i].dt * 1000).toLocaleDateString();
            const icon = weatherData[i].weather[0].icon;
            const iconDescription = weatherData[i].weather[0].description;
            const tempF = ((weatherData[i].main.temp - 273.15) * 9) / 5 + 32; // Convert temperature to Fahrenheit
            const windSpeed = weatherData[i].wind.speed;
            const humidity = weatherData[i].main.humidity;
            forecastArray.push(new Weather(city, date, icon, iconDescription, tempF, windSpeed, humidity));
        }
        return forecastArray;
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        this.cityName = city;
        const coordinates = await this.fetchAndDestructureLocationData();
        if (!coordinates) {
            throw new Error('Coordinates could not be retrieved');
        }
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData);
        const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
        console.log({ currentWeather, forecastArray });
        return { currentWeather, forecastArray };
    }
}
export default new WeatherService();

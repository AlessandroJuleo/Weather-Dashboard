import fs from 'fs-extra';
// TODO: Define a City class with name and id properties
class City {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}
// TODO: Complete the HistoryService class
class HistoryService {
    constructor() {
        // TODO: Define a read method that reads from the searchHistory.json file
        this.path = './db/db.json';
    }
    async read() {
        try {
            const data = await fs.readJson(this.path);
            return data;
        }
        catch (error) {
            console.log(error);
            return [];
        }
    }
    // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        try {
            await fs.writeJson(this.path, cities, { spaces: 2 });
            console.log('Data written to file successfully ');
        }
        catch (error) {
            console.log(error);
        }
    }
    // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        return this.read();
    }
    // TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(city) {
        try {
            const cities = await this.getCities();
            const newCity = new City(city, `${Date.now()}`);
            cities.push(newCity);
            await this.write(cities);
        }
        catch (error) {
            console.log(error);
        }
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        try {
            const cities = await this.getCities();
            const updatedCities = cities.filter(city => city.id !== id);
            await this.write(updatedCities);
        }
        catch (error) {
            console.log(error);
        }
    }
}
export default new HistoryService();

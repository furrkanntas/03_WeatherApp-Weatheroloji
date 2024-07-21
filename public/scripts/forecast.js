export default class Forecast {
    constructor() {
        this.key = '5xvbIkAIgrProKYZpGa8Q0t30cBjSw3t';
        this.weatherURI = 'http://dataservice.accuweather.com/currentconditions/v1/';
        this.cityURI = 'http://dataservice.accuweather.com/locations/v1/cities/search';
        this.timezoneURI = 'http://dataservice.accuweather.com/locations/v1/';
        this.dailyForecastURI = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';
    }

    async updateCity(city) {
        const cityDets = await this.getCity(city);
        const weather = await this.getWeather(cityDets.Key);
        const timezone = await this.getTimezone(cityDets.Key);
        const dailyForecast = await this.getDailyForecast(cityDets.Key);
        return { cityDets, weather, timezone, dailyForecast };
    }

    async getCity(city) {
        const query = `?apikey=${this.key}&q=${city}`;
        const response = await fetch(this.cityURI + query);
        const data = await response.json();
        return data[0];
    }

    async getWeather(id) {
        const query = `${id}?apikey=${this.key}`;
        const response = await fetch(this.weatherURI + query);
        const data = await response.json();
        return data[0];
    }

    async getTimezone(id) {
        const query = `${id}?apikey=${this.key}`;
        const response = await fetch(this.timezoneURI + query);
        const data = await response.json();
        return data.TimeZone;
    }

    async getDailyForecast(id) {
        const query = `${id}?apikey=${this.key}&metric=true`;
        const response = await fetch(this.dailyForecastURI + query);
        const data = await response.json();
        return data.DailyForecasts.slice(0, 4); // 3 günlük veriyi al
    }
}
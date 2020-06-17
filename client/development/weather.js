require("./vector.js");
var Weather = new class {
    constructor() {
        this._areas = [];
        this._inside = undefined;
        mp.events.add("Weather:LoadAreas", (weathers) => {
            this.loadWeather(JSON.parse(weathers));
        });
        mp.events.add("Weather:SetWeather", (weather) => {
            this.setWeather(JSON.parse(weather));
        });





        this.ticker = new mp.Event("client:Tick", () => {
            this._check();
        });
    }
    setWeather(weather_data) {
        if(this._inside == undefined) {

            mp.game.gameplay.setWind(weather_data.wind.speed);
            mp.game.gameplay.setWindDirection(weather_data.wind.dir);
            mp.game.gameplay.setWeatherTypeOverTime(weather_data.name, 1);
            mp.game.gameplay.setRainFxIntensity(weather_data.rain);
        }
    }
    loadWeather(arr) {
        let self = this;
        self._areas = arr;
        self._areas.forEach(function(area, index) {
            area.polygon.forEach(function(coords, index1) {
                self._areas[index].polygon[index1] = [coords.x, coords.y];
            })
        });
    }
    enter(key) {
        this._inside = key;
        let weather = this._areas[key];
        mp.game.gameplay.setWind(weather.wind.speed);
        mp.game.gameplay.setWindDirection(weather.wind.dir);
        mp.game.gameplay.setWeatherTypeOverTime(weather.name, 1);
        mp.game.gameplay.setRainFxIntensity(weather.rain);
        mp.events.callRemote("Weather:TransitionTo", this._inside);
    }
    exit() {
        this._inside = undefined;
        mp.events.callRemote("Weather:Exit");
        mp.game.gameplay.setWeatherTypeOverTime("CLEAR", 1);
        mp.game.gameplay.setWind(0);
        mp.game.gameplay.setWindDirection(0);
        mp.game.gameplay.setRainFxIntensity(0);
    }
    _check() {
        let self = this;
        if (self._areas.length > 0) {
            let lp = mp.vector(mp.players.local.position);
            let inside = self._areas.findIndex(function(area, key) {
                let inside1 = lp.insidePolygon(area.polygon);
                return (inside1 == true)
            })
            if (self._inside != inside) {
                if (inside > -1) {
                    self.enter(inside);
                } else {
                    self.exit();
                }
            }
        }
    }
}
module.exports = Weather;
require('dotenv').config()
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/getWeather", function (req, res) {
    const cityNames = req.body.cityName;

    const cityArray = cityNames.split(" ");    //splitting the multiple cities into an array
    const apikey = process.env.APIKEY;
    const unit = "metric";

    var weatherDataForCities = {}

    cityArray.forEach( city => {
        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid=" + apikey;

         https.get(url, function (response) {
            console.log(response.statusCode);

            if(response.statusCode===404) {
                res.write(" <h3> Couldn't find weather data for entered city </h3>" );
                res.send();
            }

            response.on("data", async function (data) {
                const weatherData = await JSON.parse(data);

                const temp = weatherData.main.temp;
                const desc = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const iconURL = " http://openweathermap.org/img/wn/" + icon + "@2x.png ";

                weatherDataForCities[city] = temp + "C";
                console.log("weatherData: ", weatherDataForCities);
                           
            })
        })
    });
    res.write(JSON.stringify(weatherDataForCities));   
    res.send();
});


app.listen(3000, function () {
    console.log("Server is running at port 3000");
})

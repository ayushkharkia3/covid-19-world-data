const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const stringToNumber = (n) => {
    x = ""
    for (var i = 0; i < n.length; i++)
        if (n[i] !== ',') {
            x += n[i];
        }
    return parseInt(x)
}

app.get('/', (req, res, next) => {
    axios({
            "method": "GET",
            "url": "https://coronavirus-monitor.p.rapidapi.com/coronavirus/affected.php",
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
                "x-rapidapi-key": "5cba36eb5cmsha37eb72a3267510p1faa3cjsnc1e3b24ef44b"
            }
        })
        .then((response) => {
            res.render('index', {
                countries: response.data.affected_countries
            });
        })
        .catch((error) => {
            console.log(error)
        })
});


app.post('/', (req, res, next) => {
    axios({
            "method": "GET",
            "url": "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php",
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
                "x-rapidapi-key": "5cba36eb5cmsha37eb72a3267510p1faa3cjsnc1e3b24ef44b"
            }
        })
        .then((response) => {
            data = response.data.countries_stat.find((e) => (e.country_name).toUpperCase() == (req.body.country).toUpperCase())
            res.render('chart', {
                death: stringToNumber(data.deaths),
                recovered: stringToNumber(data.total_recovered),
                active: stringToNumber(data.active_cases),
                total: stringToNumber(data.cases),
                death_display: data.deaths,
                recovered_display: data.total_recovered,
                active_display: data.active_cases,
                total_display: data.cases,
                country: data.country_name,
                new_total_display: data.new_cases,
                new_death_display: data.new_deaths,
                taken: response.data.statistic_taken_at
            })
        })
        .catch((error) => {
            console.log(error)
        })
});

app.use((req, res, next) => {
    res.status(404).render('404');
});

app.listen(process.env.PORT || 3000, () => {
    console.log("App is running");
});
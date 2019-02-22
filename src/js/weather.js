    var KEY = 'eaa7e82c7b7b116cf6466cb344bbff39',
        ctx = document.getElementById('myChart').getContext('2d'),
        lats = 46.469391,
        longs = 30.740883,
        citytXml = [],
        resultWeatherRequest = {},
        main = {
            temperatureUnit: 'C',
            weekDays: [],
            nameWeekDay: [],
            maximumWeekTemp: [],
            minimumWeekTemp: [],
            temperatureChart: [],
            iconWeek: [],
            list: { }
        }

    function weatherRequest() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lats + '&lon=' + longs + '&lang=ru' + '&appid=' + KEY, false);
        xhr.send();
        if (xhr.status != 200) { // обработать ошибку
            alert('Eror ' + xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
        } else {
            resultWeatherRequest = JSON.parse(xhr.responseText);
            displayMainWeather();
        }
    }
    weatherRequest();

    function weekWeather() {
        main.maximumWeekTemp.length = 0;
        main.minimumWeekTemp.length = 0;
        main.iconWeek.length = 0;
        main.nameWeekDay.length = 0;
        main.temperatureChart.length = 0;

        getWeek();

        // Получаем минимальную и максимальную температуру за сутки, иконки
        for (var i = 0; i < main.weekDays.length; i++) {
            var maximumDayTemperature = '', minimumDayTemperature = '', iconName = '';

            resultWeatherRequest.list.forEach(function (item) {
                var time = new Date(item.dt * 1000);
                if (main.weekDays[i].getDate() === time.getDate()) {
                    if (item.main.temp_max > maximumDayTemperature || maximumDayTemperature.length === 0) {
                        maximumDayTemperature = item.main.temp_max;
                        iconName = item.weather[0].icon;
                    }
                    if (item.main.temp_min < minimumDayTemperature || minimumDayTemperature.length === 0) {
                        minimumDayTemperature = item.main.temp_min;
                    }
                }
            });
            main.maximumWeekTemp.push(maximumDayTemperature);
            main.minimumWeekTemp.push(minimumDayTemperature);
            main.iconWeek.push(iconName);
        }
        for (var k = 0; k < main.weekDays.length; k++) {
            main.list[k] = {
                temperature: [],
                time: []
            };
            resultWeatherRequest.list.forEach(function (item) {
                var time = new Date(item.dt * 1000);
                if (main.weekDays[k].getDate() === time.getDate()) {
                   main.list[k].temperature.push(item.main.temp);
                   main.list[k].time.push(item.dt);
                }
            })
        }
        main.maximumWeekTemp.forEach(function (item) {
            main.temperatureChart.push(convertTemperature(item));
        });

    }
    function getWeek() {
        var tempDateDay = '';
        main.weekDays.length = 0;
        resultWeatherRequest.list.forEach(function (item) {
            var date = new Date(item.dt * 1000);
            if (tempDateDay != date.getDate()) {
                main.weekDays.push(date);
                main.nameWeekDay.push(date.toLocaleString('ru', {month: 'short', weekday: 'short', day: 'numeric'}));
                tempDateDay = date.getDate();
            }
        });
    }
    function convertTemperature(valueTemp) {
        return (main.temperatureUnit === 'C') ? Math.floor(valueTemp - 273) : Math.floor(valueTemp - 241);
    }
    dataChart = {
        labels: main.nameWeekDay,
        scaleFontColor: "white",
        datasets: [
            {
                fill: false,
                borderColor: "#37b4ee",
                borderDash: [],
                borderJoinStyle: 'miter',
                pointBorderColor: "#ddeaf8",
                pointBackgroundColor: "#ddeaf8",
                data: main.temperatureChart
            }
        ]
    };
    var chart = new Chart(ctx, {
        type: 'line',
        data: dataChart,
        options: {
            legend: {
                display: false,
                position: 'bottom'
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: "#b0bec5"
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: "#b0bec5",
                    }
                }]
            }
        }
    });







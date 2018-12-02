function Weather() {
    var KEY = 'eaa7e82c7b7b116cf6466cb344bbff39',
        self = this,
        lats = 46.469391,
        longs = 30.740883,
        week = [],
        maximumWeekTemp = [],
        minimumWeekTemp = [],
        citytXml = [],
        iconWeek = [],
        input = document.getElementById('myInput'),
        dropdownList = document.getElementById('dropdown-list'),
        daysIcon = document.getElementsByClassName('days')[0].getElementsByTagName('IMG');
        temperatureUnit = 'C';
        resultWeatherRequest = {};

    weatherRequest();
    citys();

        function weatherRequest() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lats + '&lon=' + longs + '&lang=ru' + '&appid=' + KEY, false);
            xhr.send();
            if (xhr.status != 200) { // обработать ошибку
                alert('Eror ' + xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
            } else {
                resultWeatherRequest = JSON.parse(xhr.responseText);
                console.log(resultWeatherRequest);
                displayMainWeather();
            }
        };



    input.addEventListener('keyup', function(){
        dropdownList.innerHTML = '';
        if (input.value.length) {
            var seachText = input.value.toLowerCase();
            searchCity(seachText);
        }
    });

    function searchCity(seachText){
        var cities = citytXml.getElementsByTagName('city'), resultSearch = [], resultsLat = [], resultsLon = [];

        for (var k = 0; k < cities.length; k++) {
            var atr = cities[k].getAttribute('name').toLowerCase();
            var lat = cities[k].getAttribute('lat');
            var lon = cities[k].getAttribute('lon');

            if (atr.indexOf(seachText) === 0) {
                resultSearch.push(atr);
                resultsLat.push(lat);
                resultsLon.push(lon);
            }
        }
        showResultSearch(resultSearch, resultsLat, resultsLon);
    }
    function citys() {
        var xmlDoc = new XMLHttpRequest();
        xmlDoc.open('GET', 'js/city.xml', true);
        xmlDoc.send();
        xmlDoc.onreadystatechange = function () {
            citytXml = xmlDoc.responseXML;
        }
    }
    function showResultSearch(resultSearch, resultsLat, resultsLon) {
        for (var m = 0; m < resultSearch.length; m++) {
            var li = document.createElement('li');
            li.setAttribute('data-lon', resultsLon[m]);
            li.setAttribute('data-lat', resultsLat[m]);
            li.innerText = resultSearch[m];
            dropdownList.appendChild(li);
        }
    }
    dropdownList.onclick = function (event) {
        dropdownList.innerHTML = '';
        var target = event.target;
        longs = target.getAttribute('data-lon');
        lats = target.getAttribute('data-lat');
        weatherRequest();
    }


    function setLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure);
        } else {
            message.innerText = 'Geolocation is not supported!';
        }

        function geolocationSuccess(position) {
            lats = position.coords.latitude;
            longs = position.coords.longitude;
            weatherRequest();
        }

        function geolocationFailure(positionError) {
            var eror = positionError.code;
            if (eror === 1) {
                message.innerHTML = 'Вы отказались предоставить разрешение на установку местоположения.'
            } else if (eror === 2) {
                message.innerHTML = 'Проблемы с подключением к интернету'
            } else if (eror === 3) {
                message.innerHTML = 'Не удалось установить местоположение в течении установленого времени.'
            } else {
                message.innerHTML = 'Ошибка установить местоположение, попробуйте пожалуйста еще раз.'
            }
        }
    };

    function weekWeather() {
        maximumWeekTemp.length = 0;
        minimumWeekTemp.length = 0;
        iconWeek.length = 0;

        getWeek();
        // Получаем минимальную и максимальную температуру за сутки, иконки
        for (var i = 0; i < week.length - 1; i++) {
            var maximumDayTemperature = '', minimumDayTemperature = '', iconName = '';

            resultWeatherRequest.list.forEach(function (item) {
                var time = new Date(item.dt * 1000);
                if (week[i].getDate() === time.getDate()) {
                    if (item.main.temp_max > maximumDayTemperature || maximumDayTemperature.length === 0) {
                        maximumDayTemperature = item.main.temp_max;
                        iconName = item.weather[0].icon;
                    }
                    if (item.main.temp_min < minimumDayTemperature || minimumDayTemperature.length === 0) {
                        minimumDayTemperature = item.main.temp_min;
                    }
                }
            });
            maximumWeekTemp.push(maximumDayTemperature);
            minimumWeekTemp.push(minimumDayTemperature);
            iconWeek.push(iconName);
        }
    };

    function getWeek() {
        var tempDateDay = '';
        resultWeatherRequest.list.forEach(function (item) {
            var date = new Date(item.dt * 1000);
            if (tempDateDay != date.getDate()) {
                week.push(date);
                tempDateDay = date.getDate();
            }
        });
    };

    function convertTemperature(valueTemp) {
        return (temperatureUnit === 'C') ? Math.floor(valueTemp - 273) : Math.floor(valueTemp - 241);
    };
    document.getElementById('farengeit').onclick = function () {
        temperatureUnit = 'F';
        document.getElementById('celsium').style.color = '#bababa';
        document.getElementById('farengeit').style.color = '#495057';
        displayMainWeather();
    };

    document.getElementById('celsium').onclick = function(){
        temperatureUnit = 'C';
        document.getElementById('farengeit').style.color = '#bababa';
        document.getElementById('celsium').style.color = '#495057';
        displayMainWeather();
    };
    document.getElementById('location').onclick = function () {
        setLocation();
    };

    function displayMainWeather() {
        var dayTitle = document.getElementsByClassName('day-title'),
            minTemp = document.getElementsByClassName('min-temp'),
            maxTemp = document.getElementsByClassName('max-temp');

        weekWeather();

        document.getElementById('city').innerText = resultWeatherRequest.city.name;
        document.getElementById('mainIcon').src = 'img/' + resultWeatherRequest.list[0].weather[0].icon + '.png';
        document.getElementById('temperature').innerHTML = convertTemperature(resultWeatherRequest.list[0].main.temp_max) + '&#176;';
        document.getElementById('description').innerText = resultWeatherRequest.list[0].weather[0].description;
        document.getElementById('wind').innerText = resultWeatherRequest.list[0].wind.speed + ' m/s';
        document.getElementById('presure').innerText = resultWeatherRequest.list[0].main.pressure + ' Pa';
        document.getElementById('humidity').innerText = resultWeatherRequest.list[0].main.humidity + ' %';

        for (var i = 0; i < week.length - 1; i++) {
            dayTitle[i].innerHTML = week[i].toLocaleString('ru', {weekday: 'short'});

            daysIcon[i].src = 'img/' + iconWeek[i] + '.png';
            maxTemp[i].innerHTML = convertTemperature(maximumWeekTemp[i]) + '&#176;';
            minTemp[i].innerHTML = convertTemperature(minimumWeekTemp[i]) + '&#176;';
        }

        if(temperatureUnit === 'C'){
            document.getElementById('farengeit').style.color = '#bababa';
            document.getElementById('celsium').style.color = '#495057';
        }else if(temperatureUnit === 'F'){
            document.getElementById('celsium').style.color = '#bababa';
            document.getElementById('farengeit').style.color = '#495057';
        }

    };



}
var weather = new Weather();


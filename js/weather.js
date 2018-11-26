var weather = {
    lats: '46.469391',
    longs:  '30.740883',
    key: 'eaa7e82c7b7b116cf6466cb344bbff39',
    citytXml : '',
    temperatureUnit: 'C',
    week: [],
    resultWeatherRequest: {},
    maximumWeekTemp: [],
    minimumWeekTemp: [],
    iconWeek: [],
    weatherRequest: function(){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.openweathermap.org/data/2.5/forecast?lat=' + this.lats + '&lon=' + this.longs + '&lang=ru' +  '&appid=' + this.key, false);
        xhr.send();
        if (xhr.status != 200) {   // обработать ошибку
            alert('Eror ' + xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
        } else {
            var result = JSON.parse(xhr.responseText);
            this.resultWeatherRequest = result;
            this.displayWeather();
        }
    },
    displayWeather: function(){
        var icons = document.getElementsByClassName('icon'),
            dayTitle = document.getElementsByClassName('day-title'),
            minTemp = document.getElementsByClassName('min-temp'),
            maxTemp = document.getElementsByClassName('max-temp'),
            data = this.resultWeatherRequest;

        this.clean();

        document.getElementById('city').innerText = data.city.name;
        document.getElementById('temperature').innerHTML = this.convertTemperature(data.list[0].main.temp_max);
        document.getElementById('description').innerText = data.list[0].weather[0].description;
        document.getElementById('mainIcon').src = 'img/' + data.list[0].weather[0].icon + '.png';
        document.getElementById('wind').innerText = data.list[0].wind.speed + ' m/s';
        document.getElementById('presure').innerText = data.list[0].main.pressure + ' Pa';
        document.getElementById('humidity').innerText = data.list[0].main.humidity + ' %';

        this.displayDaysWeather();

        for(var i = 0; i < this.week.length; i++){

            dayTitle[i].innerHTML = this.week[i].toLocaleString('ru', {weekday: 'short'});
            icons[i].getElementsByTagName('IMG')[0].src = 'img/' + this.iconWeek[i] + '.png';
            maxTemp[i].innerHTML = this.convertTemperature(this.maximumWeekTemp[i]) + '&#176;';
            minTemp[i].innerHTML = this.convertTemperature(this.minimumWeekTemp[i]) + '&#176;';
        }
    },
    displayDaysWeather: function () {
            this.getWeek();

            // Получаем минимальную и максимальную температуру за сутки, иконки
            for(var i = 0; i < this.week.length; i++){
                var maximumDayTemperature = '', minimumDayTemperature = '', iconName = '';

                this.resultWeatherRequest.list.forEach(function(item) {
                    var time = new Date(item.dt * 1000);
                    if(weather.week[i].getDate() === time.getDate()){
                        if(item.main.temp_max > maximumDayTemperature || maximumDayTemperature.length === 0){
                            maximumDayTemperature = item.main.temp_max;
                            iconName = item.weather[0].icon;
                        }
                        if(item.main.temp_min < minimumDayTemperature || minimumDayTemperature.length === 0){
                            minimumDayTemperature = item.main.temp_min;
                        }
                    }
                });
                weather.maximumWeekTemp.push(maximumDayTemperature);
                weather.minimumWeekTemp.push(minimumDayTemperature);
                weather.iconWeek.push(iconName);
            }
    },
    setLocation: function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure);
        } else {
            message.innerText = 'Geolocation is not supported!';
        }
        function geolocationSuccess(position) {
            weather.lats = position.coords.latitude;
            weather.longs = position.coords.longitude;
            weather.weatherRequest();
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
    },
    getWeek: function () {
        var temtpDateDay = '';

        this.resultWeatherRequest.list.forEach(function (item) {
            var date = new Date(item.dt * 1000);
            if(temtpDateDay != date.getDate()){
                weather.week.push(date);
                temtpDateDay = date.getDate();
            }
        });
    },
    convertTemperature: function(valueTemp){
        return (this.temperatureUnit === 'C') ?  Math.floor(valueTemp - 273) :  Math.floor(valueTemp - 241);
    },
    clean: function () {
        this.maximumWeekTemp.length = 0;
        this.minimumWeekTemp.length = 0;
        this.iconWeek.length = 0;
    }
};

document.getElementById('farengeit').onclick = function(){
    weather.temperatureUnit = 'F';
    weather.displayWeather();
};
document.getElementById('celsium').onclick = function(){
    weather.temperatureUnit = 'C';
    weather.displayWeather();
};
document.getElementById('location').onclick = function(){
    weather.setLocation();
};
weather.weatherRequest();

//
// function citys() {
//     var xmlDoc = new XMLHttpRequest();
//     xmlDoc.open('GET', 'js/city.xml', true);
//     xmlDoc.send();
//     xmlDoc.onreadystatechange = function(){
//         citytXml = xmlDoc.responseXML;
//     }
// };
//
//
// function searchCity(seachText) {
//     var cities = citytXml.getElementsByTagName('city'),
//         resultSearch = [],
//         resultsLat = [],
//         resultsLon = [];
//
//     for(var k = 0; k < cities.length; k++){
//         var atr = cities[k].getAttribute('name').toLowerCase();
//         var lat = cities[k].getAttribute('lat');
//         var lon =  cities[k].getAttribute('lon');
//
//         if(atr.indexOf(seachText) === 0){
//             resultSearch.push(atr);
//             resultsLat.push(lat);
//             resultsLon.push(lon);
//
//         }
//     }
//     showResultSearch(resultSearch, resultsLat, resultsLon);
// }

// var input = document.getElementById('myInput'),
//     dropdownList = document.getElementById('dropdown-list');
//
//
// input.addEventListener('keyup', function() {
//     dropdownList.innerHTML = '';
//     if(input.value.length){
//         var seachText = input.value.toLowerCase();
//         searchCity(seachText);
//     }
// });

//
// function showResultSearch(resultSearch, resultsLat, resultsLon) {
//     for(var m = 0; m < resultSearch.length; m++){
//         var li = document.createElement('li');
//         li.setAttribute('data-lon', resultsLon[m]) ;
//         li.setAttribute('data-lat', resultsLat[m]) ;
//         li.innerText = resultSearch[m];
//         dropdownList.appendChild(li);
//     }
//     console.log(resultSearch);
// }
//

// dropdownList.onclick = function (event) {
//     var target = event.target;
//
//     longs = target.getAttribute('data-lon');
//     lats = target.getAttribute('data-lat');
//     weather(lats, longs);
//
//     dropdownList.innerHTML = '';
// }
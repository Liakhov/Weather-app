var lats, longs, tempDate,
    message = document.getElementById('message'),
    key = 'eaa7e82c7b7b116cf6466cb344bbff39',
    arrDays = document.querySelectorAll('.day-item');

var options = {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
};
var optionss = {
    weekday: 'short'
};

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure)
} else {
    message.innerText = 'Geolocation is not supported!';
}

function geolocationSuccess(position) {
    lats = position.coords.latitude;
    longs = position.coords.longitude;
    weather(lats, longs);
}

function weather() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lats + '&lon=' + longs + '&appid=' + key, false);
    xhr.send();
    if (xhr.status != 200) {
        // обработать ошибку
        alert('Eror ' + xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
    } else {
        var result = JSON.parse(xhr.responseText);
        displayWeather(result);
    }
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

function displayWeather(result) {
    // Выводим в HTML текущую погоду
    city.innerHTML = result.city.name;
    temperature.innerHTML = Math.floor(result.list[0].main.temp - 273) + '&#176;';
    icon.src = 'https://openweathermap.org/img/w/' + result.list[0].weather[0].icon + '.png';
    description.innerHTML = result.list[0].weather[0].description;
    wind.innerHTML = 'Wind: ' + result.list[0].wind.speed + ' m/s';
    presure.innerHTML = 'Presure:' + result.list[0].main.pressure;
    cloud.innerHTML = 'Clouds: ' + result.list[0].clouds.all;
    tempDate = new Date(result.list[0].dt * 1000);
    nowDate.innerHTML = tempDate.toLocaleString("en", options);


    console.log(result);

    // Нумерация для записи HTML по дням
    var l = 0;

     result.list.forEach(function(item, i) {

            var datesset = new Date(result.list[i].dt * 1000);

           if(tempDate.getDate() != datesset.getDate() ){
               tempDate = datesset;

               var b = arrDays[l].querySelector('.day-title');
               var dataImg = arrDays[l].querySelector('.icon');
               var maxDayTemp = arrDays[l].querySelector('.max-temp');
               var dateFormat = new Date(item.dt * 1000);


               b.innerText = dateFormat.toLocaleString("ru", optionss);
               dataImg.innerHTML = '<img src=https://openweathermap.org/img/w/' + item.weather[0].icon + '.png' + '>';
               maxDayTemp.innerHTML = Math.floor(item.main.temp - 273) + '&#176;';

               l++;
           }
     });
}




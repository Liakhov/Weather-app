document.addEventListener('DOMContentLoaded', function(){
    var tempDate,
        message = document.getElementById('message'),
        arrDays = document.querySelectorAll('.day-item'),
        location = document.getElementById('location'),
        currentDate = document.getElementById('currentDate'),
        key = 'eaa7e82c7b7b116cf6466cb344bbff39',
        lats = lats || 50.44,
        longs = longs || 30.51;

    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'

    };

    function weather(){
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

    location.onclick = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationFailure);
        } else {
            message.innerText = 'Geolocation is not supported!';
        }

        function geolocationSuccess(position) {
            lats = position.coords.latitude;
            longs = position.coords.longitude;
            weather(lats, longs);
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


    function displayWeather(result) {
        var nowDate = new Date(result.list[0].dt * 1000),
            arrDisplayDate = [],
            arrlistDay = [], // Масив для вывода возможных дат
            temtpDateDay = ''; // Временная переменная для сравнения даты

        // Выводим в HTML текущую погоду
        city.innerHTML = result.city.name;
        temperature.innerHTML = Math.floor(result.list[0].main.temp_max - 273) + '&#176;';
        icon.src = 'img/' + result.list[0].weather[0].icon + '.png';
        description.innerHTML = result.list[0].weather[0].description;
        wind.innerHTML = result.list[0].wind.speed + ' m/s';
        presure.innerHTML = result.list[0].main.pressure + ' Pa';
        humidity.innerHTML = result.list[0].main.humidity + ' %';
        tempDate = new Date(result.list[0].dt * 1000);
        currentDate.innerHTML = tempDate.toLocaleString("en", options);

        console.log(result);

        //Масив возможных дат
        result.list.forEach(function (item) {
            var date = new Date(item.dt * 1000);

            if(temtpDateDay != date.getDate()){
                arrlistDay.push(date.getDate());
                temtpDateDay = date.getDate();

                arrDisplayDate.push(date.toLocaleString('en', {weekday: 'short'}));
            }
        });
        //Start// Получаем минимальную и максимальную температуру за сутки по каждой дате массива arrlistDay
        for(var i = 0; i < arrlistDay.length; i++ ){
            var maximumDayTemperature = 0,
                minimumDayTemperature = 0,
                iconName = '',
                img = document.createElement('IMG');

            result.list.forEach(function(item) {
                var time = new Date(item.dt * 1000);

                if(arrlistDay[i] === time.getDate()){

                    if(Math.floor(item.main.temp_max - 273) > maximumDayTemperature){
                        maximumDayTemperature = Math.floor(item.main.temp_max - 273);
                        iconName = item.weather[0].icon;
                    }else if(Math.floor(item.main.temp_min - 273) < minimumDayTemperature){
                        minimumDayTemperature = Math.floor(item.main.temp_min - 273);
                    }
                }
                iconName = iconName || item.weather[0].icon; // Проверка на присвоение иконки (актуально для первого елемента, он не входит в условие)
            });
            ;
            document.getElementsByClassName('day-title')[i].innerText = arrDisplayDate[i];
            document.getElementsByClassName('icon')[i].appendChild(img);
            img.src = 'img/' + iconName + '.png';
            document.getElementsByClassName('max-temp')[i].innerHTML = maximumDayTemperature + '&#176 C';
            document.getElementsByClassName('min-temp')[i].innerHTML = minimumDayTemperature + '&#176 C';

        }
        //Finish// Получаем минимальную и максимальную температуру за сутки
    };
    weather();

});





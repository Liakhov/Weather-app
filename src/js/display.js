var optionsFormatDate = {weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    dropdownList = document.getElementById('form__dropdown'),
    input = document.getElementById('form__input'),
    daysIcon = document.getElementsByClassName('days__img');
    document.getElementById('currentDate').innerText = new Date().toLocaleString('ru', optionsFormatDate);

    function displayMainWeather() {
        var dayTitle = document.getElementsByClassName('days__title'),
            minTemp = document.getElementsByClassName('days__min-temp'),
            maxTemp = document.getElementsByClassName('days__max-temp');

        if(main.temperatureUnit === 'C'){
            document.getElementById('farengeit').style.color = '#495057';
            document.getElementById('celsium').style.color =  '#bababa';
        }else if(main.temperatureUnit === 'F'){
            document.getElementById('celsium').style.color =  '#495057';
            document.getElementById('farengeit').style.color = '#bababa';
        }

        weekWeather();

        document.getElementById('city').innerText = resultWeatherRequest.city.name;
        document.getElementById('mainIcon').src = 'img/' + resultWeatherRequest.list[0].weather[0].icon + '.png';
        document.getElementById('temperature').innerHTML = convertTemperature(resultWeatherRequest.list[0].main.temp_max) + '&#176;';
        document.getElementById('description').innerText = resultWeatherRequest.list[0].weather[0].description;
        document.getElementById('wind').innerText = 'Ветер: ' +  resultWeatherRequest.list[0].wind.speed + ' м/с';
        document.getElementById('presure').innerText = resultWeatherRequest.list[0].main.pressure + ' Pa';

        for (var i = 0; i < main.weekDays.length -1 ; i++) {
            dayTitle[i].innerHTML = main.weekDays[i].toLocaleString('ru', {weekday: 'long'});
            daysIcon[i].src = 'img/' + main.iconWeek[i] + '.png';
            maxTemp[i].innerHTML = convertTemperature(main.maximumWeekTemp[i]) + '&#176;';
            minTemp[i].innerHTML = convertTemperature(main.minimumWeekTemp[i]) + '&#176;';
        }
    }
    document.getElementById('farengeit').onclick = function () {
        main.temperatureUnit = 'F';
        document.getElementById('checkbox1').checked = true;
        document.getElementById('celsium').style.color = '#bababa';
        document.getElementById('farengeit').style.color = '#495057';
        displayMainWeather();
        chart.update();
    };
    document.getElementById('celsium').onclick = function(){
        main.temperatureUnit = 'C';
        document.getElementById('checkbox1').checked = false;
        document.getElementById('farengeit').style.color = '#bababa';
        document.getElementById('celsium').style.color =  '#495057';
        displayMainWeather();
        chart.update();
    };
    document.getElementById('city').onclick = function () {
        main.temperatureChart.length = 0;
        main.nameWeekDay.length = 0;

        main.maximumWeekTemp.forEach(function (item) {
            main.temperatureChart.push(convertTemperature(item));
        });

        main.weekDays.forEach(function (item) {
            main.nameWeekDay.push(item.toLocaleString('ru', {month: 'short', weekday: 'short', day: 'numeric'}));
        });

        chart.update();
    };
    document.getElementById('settings').onclick = function(){
        document.getElementsByClassName('popup__body')[0].classList.add('active');
    };
    document.getElementById('settings').onclick = function(){
        document.getElementsByClassName('popup__body')[0].classList.toggle('active');
    };
    document.getElementsByClassName('popup__close-button')[0].onclick = function(){
        document.getElementsByClassName('popup__body')[0].classList.toggle('active');
    };

    document.getElementById('checkbox1').onclick = function () {
        var checkBox = document.getElementById('checkbox1');
        if (checkBox.checked == true){
            main.temperatureUnit = 'F';
            document.getElementsByClassName('farengeit')[0].style.color = '#8493a8';
            document.getElementsByClassName('celsium')[0].style.color = '#bababa';

        }else{
            main.temperatureUnit = 'C';
            document.getElementsByClassName('farengeit')[0].style.color = '#bababa';
            document.getElementsByClassName('celsium')[0].style.color = '#8493a8';
        }
        displayMainWeather();
    };
    document.getElementById('checkbox2').onclick = function () {
        document.getElementsByClassName('container')[0].classList.toggle('light');
    };
    function formatDate(item) {
        return new Date(item * 1000).getHours() + '.00';
    }
    document.querySelectorAll('.days')[0].onclick = function (event) {
        var target = event.target;
        while (target.tagName != 'div' && target.tagName != null) {
            if (target.classList == 'days__item') {
                displayDayChart(target.getAttribute('data-order'));
                return;
            }
            target = target.parentNode;
        }
    };
    function displayDayChart(order) {
        main.temperatureChart.length = 0;
        main.nameWeekDay.length = 0;

        main.list[order].temperature.forEach(function (item) {
           main.temperatureChart.push(convertTemperature(item));
        });
        main.list[order].time.forEach(function (item) {
            main.nameWeekDay.push(formatDate(item));
        });
        chart.update();
    }
    // Search city
    input.addEventListener('keyup', function(){
        dropdownList.innerHTML = '';
        if (input.value.length) {
            var seachText = input.value.toLowerCase();
            searchCity(seachText);
        }
    });
    dropdownList.onclick = function (event) {
        dropdownList.innerHTML = '';
        var target = event.target;
        longs = target.getAttribute('data-lon');
        lats = target.getAttribute('data-lat');
        weatherRequest();
        chart.update();
    };
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
    function cityUkraine() {
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
    cityUkraine();

    document.getElementById('location').onclick = function () {
        setLocation();
    };
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
            chart.update();
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
    }
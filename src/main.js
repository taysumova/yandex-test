document.addEventListener('DOMContentLoaded', function () {
    //"af16f9-d15de2" - another key in case if below one will exceed its limit;
    //for API cities in Russian - http://api.travelpayouts.com/data/ru/cities.json
    
    //глобальные переменные
    let departureObj = {},
        arrivalObj = {},
        showedTime = new Date();

    //получаем JSON объект из API - departure
    var departureReq = new XMLHttpRequest();
    departureReq.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            departureObj = JSON.parse(this.responseText);
        }
    };

    departureReq.open("GET", "https://aviation-edge.com/v2/public/timetable?key=f25965-b40571&iataCode=SVO&type=departure", true);
    departureReq.send();


    //получаем JSON объект из API - arrival
    var arrivalReq = new XMLHttpRequest();
    arrivalReq.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            arrivalObj = JSON.parse(this.responseText);
        }
    };

    arrivalReq.open("GET", "https://aviation-edge.com/v2/public/timetable?key=f25965-b40571&iataCode=SVO&type=arrival", true);
    arrivalReq.send();

    function getTodayDate() {
        let todayDate = document.querySelector('.todayDate'),
            date = new Date(),
            fullMinutes = date.getMinutes();

        if (fullMinutes < 10) {
            fullMinutes = '0' + date.getMinutes();
        } else {
            fullMinutes = date.getMinutes();
        }

        todayDate.innerHTML = date.toLocaleDateString('ru-RU') + ' ' + date.getHours() + ':' + fullMinutes;
    }

    getTodayDate();
    setInterval(getTodayDate, 1000 * 30);

    //функция для перевода городов на русский язык
    function changeToRussianCity(cityCode) {
        var myJsonCities = JSON.parse(myData); // внешний файл js - cities.js
        if (myJsonCities.hasOwnProperty(cityCode)) {
            return myJsonCities[cityCode];
        } else {
            return cityCode;
        }

    }

    function checkTerminal(terminal) {
        if (!terminal) {
            return terminal = "—";
        } else {
            return terminal;
        }
    }

    function statusInRussian(status) {
        switch (status) {
            case "landed":
                status = "Совершил посадку";
                break;
            case "scheduled":
                status = "По расписанию";
                break;
            case "cancelled":
                status = "Отменен";
                break;
            case "active":
                status = "В полете";
                break;
            case "incident":
                status = "Инцидент/авария";
                break;
            case "diverted":
                status = "Отменен";
                break;
            case "redirected":
                status = "Перенаправлен";
                break;
            case "unknown":
                status = "Неизвестен";
                break;
        }
        return status;
    }


    function searchFlight(searchFlightNum) {
        for (let i = 0; i < departureObj.length; i++) {
            let flightNum = departureObj[i].flight.number;
            if (searchFlightNum == flightNum) {
                return {
                    dirType: "departure",
                    num: i
                };
            }
        }

        for (let i = 0; i < arrivalObj.length; i++) {
            let flightNum = arrivalObj[i].flight.number;
            if (searchFlightNum == flightNum) {
                return {
                    dirType: "arrival",
                    num: i
                };
            }
        }

        return 0;
    }

    function getFoundFlight() {
        let inputFlightNum = document.getElementById("input");
        inputFlightNum = inputFlightNum.value;
        let flightObj = searchFlight(inputFlightNum),
            initNum = flightObj.num;
        if (!initNum) {
            $("#informationTable").append('<p class="timeTableData">He найдено...<br>Проверьте корректность введенного номера</p>');
        } else {
            $('#timeTable').show();
            let dirType = flightObj.dirType;
            if (dirType == "departure") {
                $('button').removeClass('button-active');
                $("#departure").addClass('button-active');
                getDeparture(initNum, initNum + 1, 1);
            } else {
                $('button').removeClass('button-active');
                $("#arrival").addClass('button-active');
                getArrival(initNum, initNum + 1, 1);
            }
        }
    }

    //получение информации по отправлению из JSON и добавление в таблицу
    function getDeparture(initArg, endArg, num) {
        for (let i = initArg; i < endArg; i++) {
            let time = departureObj[i].departure.scheduledTime,
                city = departureObj[i].arrival.iataCode,
                airline = departureObj[i].airline.name,
                flightNum = departureObj[i].flight.iataNumber,
                terminal = departureObj[i].departure.terminal,
                status = departureObj[i].status;

            time = time[11] + time[12] + time[13] + time[14] + time[15];
            city = changeToRussianCity(city);
            terminal = checkTerminal(terminal);
            status = statusInRussian(status);

            $(".timeTableInfo").append('<tr class="timeTableData"><td>' + num + '</td><td>' + time + '</td><td>' + city + '</td><td>' + airline + '</td><td>' + flightNum + '</td><td>' + terminal + '</td><td>' + status + '</td></tr>');
            num++;
        }
    }

    //получение информации по прибытию из JSON и добавление в таблицу
    function getArrival(initArg, endArg, num) {
        for (let i = initArg; i < endArg; i++) {
            let time = arrivalObj[i].arrival.scheduledTime,
                city = arrivalObj[i].departure.iataCode,
                airline = arrivalObj[i].airline.name,
                flightNum = arrivalObj[i].flight.iataNumber,
                terminal = arrivalObj[i].arrival.terminal,
                status = arrivalObj[i].status;

            time = time[11] + time[12] + time[13] + time[14] + time[15];
            city = changeToRussianCity(city);
            terminal = checkTerminal(terminal);
            status = statusInRussian(status);

            $(".timeTableInfo").append('<tr class="timeTableData"><td>' + num + '</td><td>' + time + '</td><td>' + city + '</td><td>' + airline + '</td><td>' + flightNum + '</td><td>' + terminal + '</td><td>' + status + '</td></tr>');
            num++;
        }
    }

    //получение задержанных рейсов - только вылет
    function getDelays(initArg, endArg, num) {
        for (let i = initArg; i < endArg; i++) {
            let time = departureObj[i].departure.scheduledTime,
                city = departureObj[i].arrival.iataCode,
                flightNum = departureObj[i].flight.iataNumber,
                delay = departureObj[i].arrival.delay;

            time = time[11] + time[12] + time[13] + time[14] + time[15];
            city = changeToRussianCity(city);

            if (delay) {
                $(".timeTableInfo").append('<tr class="timeTableData"><td>' + num + '</td><td>' + time + '</td><td>' + city + '</td><td>Вылет рейса &#8470; ' + flightNum + ' задержан на ' + delay + ' мин.</td></tr>');
                num++;
            }
        }
    }

    $('select').change(function () {
        let selectedTime = this.value;
        showedTime = new Date();
        showedTime.setHours(showedTime.getHours() - selectedTime);
    });

    $("#submit").click(function () {
        $('#timeTable').hide();
        $("#delaysTable").hide();
        $('.timeTableData').remove();
        getFoundFlight();
    });


    $("#departure").click(function () {
        $('button').removeClass('button-active');
        $("#departure").addClass('button-active');
        $('#timeTable').show();
        $("#delaysTable").hide();
        $('.timeTableData').remove();
        let num = 1,
            initNum = 0;

        for (let i = 0; i < departureObj.length; i++) {
            if (showedTime < new Date(departureObj[i].departure.scheduledTime)) {
                initNum = i;
                break;
            }
        }
        getDeparture(initNum, departureObj.length, num);
    });


    $("#arrival").click(function () {
        $('button').removeClass('button-active');
        $("#arrival").addClass('button-active');
        $('#timeTable').show();
        $('#delaysTable').hide();
        $('.timeTableData').remove();

        let num = 1,
            initNum = 0;

        for (let i = 0; i < arrivalObj.length; i++) {
            if (showedTime < new Date(arrivalObj[i].arrival.scheduledTime)) {
                initNum = i;
                break;
            }
        }

        getArrival(initNum, arrivalObj.length, num);
    });


    $("#delays").click(function () {
        $('button').removeClass('button-active');
        $("#delays").addClass('button-active');
        $('#delaysTable').show();
        $('#timeTable').hide();
        $('#load-more').hide();
        $('.timeTableData').remove();
        let num = 1,
            initNum = 0;
        for (let i = 0; i < departureObj.length; i++) {
            if (showedTime < new Date(departureObj[i].departure.scheduledTime)) {
                initNum = i;
                break;
            }
        }
        getDelays(initNum, departureObj.length, num);

    });
});

//var i = "af16f9-d15de2" - another key in case if below one will exceed its limit;

/*for API cities in Russian - http://api.travelpayouts.com/data/ru/cities.json*/
//function for cities in russian

function getTodayDate() {
    var todayDate = document.querySelector('.todayDate');
    var date = new Date();
    todayDate.innerHTML = 'Сегодня: ' + date.toLocaleDateString('ru-RU');
}

getTodayDate();

function changeToRussianCity(cityCode) {
    var myJsonCities = JSON.parse(myData);
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
            status = "По расписанию"; //to add time to func getArrival
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

function searchFlight(myObj, inputFlightNum) {
    for (var i = 0; i < myObj.length; i++) {
        var flightNum = myObj[i].flight.number;
        if (inputFlightNum == flightNum) {
            return i;
        }
    }
    return 0;
}

function getFoundFlight(myObj) {
    var inputFlightNum = document.getElementById("input");
    var inputFlightNum = inputFlightNum.value;
    var initNum = searchFlight(myObj, inputFlightNum);
    if (!initNum) {
        $("#informationTable").append('<p class="timeTableData">He найдено...<br>Проверьте корректность введенного номера</p>');
    } else {
        $('#timeTable').show();
        var dirType = myObj[initNum].type;
        if (dirType == "departure") {
            var departureTime = myObj[initNum].departure.scheduledTime;
            departureTime = departureTime[11] + departureTime[12] + departureTime[13] + departureTime[14] + departureTime[15];
            var arrivalCity = myObj[initNum].arrival.iataCode;
            arrivalCity = changeToRussianCity(arrivalCity);
            var airline = myObj[initNum].airline.name;
            var flightNum = myObj[initNum].flight.iataNumber;
            var terminal = myObj[initNum].departure.terminal;
            terminal = checkTerminal(terminal);
            var status = myObj[initNum].status;
            status = statusInRussian(status);
            $(".timeTableInfo").append('<tr class="timeTableData"><td>' + 1 + '</td><td>' + departureTime + '</td><td>' + arrivalCity + '</td><td>' + airline + '</td><td>' + flightNum + '</td><td>' + terminal + '</td><td>' + status + '</td></tr>');
        } else {
            var departureTime = myObj[initNum].arrival.scheduledTime;
            departureTime = departureTime[11] + departureTime[12] + departureTime[13] + departureTime[14] + departureTime[15];
            var arrivalCity = myObj[initNum].departure.iataCode;
            arrivalCity = changeToRussianCity(arrivalCity);
            var airline = myObj[initNum].airline.name;
            var flightNum = myObj[initNum].flight.iataNumber;
            var terminal = myObj[initNum].arrival.terminal;
            terminal = checkTerminal(terminal);
            var status = myObj[initNum].status;
            status = statusInRussian(status);
            $(".timeTableInfo").append('<tr class="timeTableData"><td>' + 1 + '</td><td>' + departureTime + '</td><td>' + arrivalCity + '</td><td>' + airline + '</td><td>' + flightNum + '</td><td>' + terminal + '</td><td>' + status + '</td></tr>');
        }
    }
}

//for departure information
function getDeparture(myObj, initArg, endArg) {
    var num = 1;
    var i = initArg;
    for (i; i < endArg; i++) {
        var departureTime = myObj[i].departure.scheduledTime;
        departureTime = departureTime[11] + departureTime[12] + departureTime[13] + departureTime[14] + departureTime[15];
        var arrivalCity = myObj[i].arrival.iataCode;
        arrivalCity = changeToRussianCity(arrivalCity);
        var airline = myObj[i].airline.name;
        var flightNum = myObj[i].flight.iataNumber;
        var terminal = myObj[i].departure.terminal;
        terminal = checkTerminal(terminal);
        var status = myObj[i].status;
        status = statusInRussian(status);
        $(".timeTableInfo").append('<tr class="timeTableData"><td>' + num + '</td><td>' + departureTime + '</td><td>' + arrivalCity + '</td><td>' + airline + '</td><td>' + flightNum + '</td><td>' + terminal + '</td><td>' + status + '</td></tr>');
        num++;
    }
}


//for arrivals - need to be changed
function getArrival(myObj, initArg, endArg) {
    var num = 1;
    var i = initArg;
    for (i; i < endArg; i++) {
        var arrivalTime = myObj[i].arrival.scheduledTime;
        arrivalTime = arrivalTime[11] + arrivalTime[12] + arrivalTime[13] + arrivalTime[14] + arrivalTime[15];
        var departureCity = myObj[i].departure.iataCode;
        departureCity = changeToRussianCity(departureCity);
        var airline = myObj[i].airline.name;
        var flightNum = myObj[i].flight.iataNumber;
        var terminal = myObj[i].arrival.terminal;
        terminal = checkTerminal(terminal);
        var status = myObj[i].status;
        status = statusInRussian(status);
        $(".timeTableInfo").append('<tr class="timeTableData"><td>' + num + '</td><td>' + arrivalTime + '</td><td>' + departureCity + '</td><td>' + airline + '</td><td>' + flightNum + '</td><td>' + terminal + '</td><td>' + status + '</td></tr>');
        num++;
    }
}

//function for delays - departure
function getDelays(myObj, initArg, endArg) {
    var num = 1;
    var i = initArg;
    for (i; i < endArg; i++) {
        var departureTime = myObj[i].departure.scheduledTime;
        departureTime = departureTime[11] + departureTime[12] + departureTime[13] + departureTime[14] + departureTime[15];
        var arrivalCity = myObj[i].arrival.iataCode;
        arrivalCity = changeToRussianCity(arrivalCity);
        var flightNum = myObj[i].flight.iataNumber;
        var delay = myObj[i].arrival.delay;
        if (delay) {
            $(".timeTableInfo").append('<tr class="timeTableData"><td>' + num + '</td><td>' + departureTime + '</td><td>' + arrivalCity + '</td><td>Вылет рейса &#8470; ' + flightNum + ' задержан на ' + delay + ' мин.</td></tr>');
            num++;
        }
    }
}

//calling the departure list with departure button
$("#departure").click(function () {
    $('button').removeClass('button-active');
    $("#departure").addClass('button-active');
    $('#timeTable').show();
    $("#delaysTable").hide();
    $('.timeTableData').remove();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            getDeparture(myObj, 0, myObj.length);
            $("#submit").click(function () {
                $('#timeTable').hide();
                $("#delaysTable").hide();
                $('.timeTableData').remove();
                getFoundFlight(myObj);
            });
        }
    };

    xmlhttp.open("GET", "https://aviation-edge.com/v2/public/timetable?key=f25965-b40571&iataCode=SVO&type=departure", true);
    xmlhttp.send();
});


//calling the arrival list with arrival button
$("#arrival").click(function () {
    $('button').removeClass('button-active');
    $("#arrival").addClass('button-active');
    $('#timeTable').show();
    $('#delaysTable').hide();
    $('.timeTableData').remove();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            getArrival(myObj, 0, myObj.length);
            $("#submit").click(function () {
                $('#timeTable').hide();
                $("#delaysTable").hide();
                $('.timeTableData').remove();
                getFoundFlight(myObj);
            });
        }
    };

    xmlhttp.open("GET", "https://aviation-edge.com/v2/public/timetable?key=f25965-b40571&iataCode=SVO&type=arrival", true);
    xmlhttp.send();
});


//calling the delays list with delay button
$("#delays").click(function () {
    $('button').removeClass('button-active');
    $("#delays").addClass('button-active');
    $('#delaysTable').show();
    $('#timeTable').hide();
    $('.timeTableData').remove();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            getDelays(myObj, 0, myObj.length);
        }
    };

    xmlhttp.open("GET", "https://aviation-edge.com/v2/public/timetable?key=f25965-b40571&iataCode=SVO&type=departure", true);
    xmlhttp.send();
});



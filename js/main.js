document.getElementById("selectCity").addEventListener("change", function(){
    var selectedOption = this.options[this.selectedIndex];
    var selectedValue = selectedOption.value;
    var selectedText = selectedOption.textContent;
    //show loader on api call
    showLoader(selectedText);
    document.getElementById("apiResponse").style.display = 'none';
    document.getElementById("apiResponse").innerHTML = '';
    //parse selected value
    var jsonParser = JSON.parse(selectedValue);
    var latitude = jsonParser.lat;
    var longitude = jsonParser.lon;
    //console.log("Selected Value: " + selectedText + ", Coordinates: " + latitude + longitude);
    //7 timer api url (free api)
    var apiUrl = 'http://www.7timer.info/bin/api.pl?lon=' + latitude + '&lat=' + longitude + '&product=civillight&output=json';
    //console.log("API URL: ", apiUrl);
    try{
        fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Data is now a JavaScript object
            hideLoader();
            document.getElementById("apiResponse").style.display = 'block';
            populateWeather(data.dataseries, selectedText);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }catch(error){
        console.log("Error: ", error);
        hideLoader();
    }
});

function showLoader(selectedText){
    document.getElementById("loader").style.display = 'block';
    document.getElementById("loaderText").innerHTML = '<b><u>' + selectedText + '</u></b> Weather details will be published shortly...';
}

function hideLoader(){
    document.getElementById("loader").style.display = 'none';
}

function populateWeather(dataseries, selectedText){
    console.log("hello");
    var container = document.getElementById("apiResponse");
    document.getElementById("resultedCity").innerHTML = 'Showing weather of <u><b>' + selectedText + '</b></u> for next 07 days';
    dataseries.forEach(series =>{
        var div = document.createElement("div");
        div.classList.add("weather-entry", "singleWeather", "mb-5");
        var dateString = series.date.toString();
        var year = dateString.slice(0, 4);
        var month = dateString.slice(4, 6);
        var day = dateString.slice(6, 8);

        var monthNumber = parseInt(month, 10);
        var dateObj = new Date(year, monthNumber - 1, day);
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var formattedDay = dayNames[dateObj.getDay()];
        var formattedDate = formattedDay + ', ' + monthNames[monthNumber - 1] + ' ' + day;
        if(series.weather === 'ts'){
            var weatherType = 'Thunderstorms';
        }else if(series.weather === 'pcloudy'){
            var weatherType = 'Partial Cloudy';
        }else{
            var weatherType = series.weather;
        }
        var htmlContent = `
            <div class="upperPart">
                <p class="weatherDate"> ${formattedDate} </p>
                <p class="weatherImage"><img src="./images/${series.weather === 'ts'?'tstorm':'clear'}.png" alt="Weather at ${selectedText} will be ${series.weather}" ></p>
            </div>
            <div class="lowerPart">
                <p class="weatherType mb-1">${weatherType}</p>
                <p class="weatherHighTemp mb-0">Low: ${series.temp2m.min}<sup>o</sup> C</p>
                <p class="weatherLowTemp">High: ${series.temp2m.max}<sup>o</sup> C</p>
            </div>
        `;
        div.innerHTML = htmlContent;
        container.appendChild(div);
    });
}
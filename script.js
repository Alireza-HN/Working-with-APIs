let countryLat = -25.344;
let countryLng = 131.036;

$(document).ready(function () 
{
    //an array for containing countries
    let countries = [];

    $.get('https://restcountries.eu/rest/v2/all', function (data) 
    {
        countries = data;

        
        for (let i = 0; i < countries.length; i++)
        {
            $("#countrySelect").append(`<option value="${i}">${countries[i].name}</option>`);
        }

        $("#countrySelect").on("change", function () 
        {
            //remove 'Select a country...' option
            $("option[value='nothingSelected']").remove();

            $("#overallInfo h3").html(countries[$(this).val()].name);
            $(".statisticsContainer:nth-child(2) p.statisticInfo").html(countries[$(this).val()].nativeName);
            $(".statisticsContainer:nth-child(3) p.statisticInfo").html(countries[$(this).val()].capital);
            $(".statisticsContainer:nth-child(4) p.statisticInfo").html(`${countries[$(this).val()].region}, 
            ${countries[$(this).val()].subregion}`);
            $(".statisticsContainer:nth-child(5) p.statisticInfo").html(countries[$(this).val()].population);
            $(".statisticsContainer:nth-child(6) p.statisticInfo").html(countries[$(this).val()].languages[0].name);

                 
            if (countries[$(this).val()].timezones.length === 0) {
                $(".statisticsContainer:nth-child(7) p.statisticInfo").html("NO TIMEZONE");
            }
            
            else if (countries[$(this).val()].timezones.length === 1) {
                $(".statisticsContainer:nth-child(7) p.statisticInfo").html(countries[$(this).val()].timezones);
            }

            else if (countries[$(this).val()].timezones.length > 1) 
            {
                $(".statisticsContainer:nth-child(7) p.statisticInfo").html(countries[$(this).val()].timezones[0]);


                for (let i = 1; i < countries[$(this).val()].timezones.length; i++) 
                {         
                    $(".statisticsContainer:nth-child(7) p.statisticInfo").append(`, 
                    ${countries[$(this).val()].timezones[i]}`);
                }
            }
            


            if (countries[$(this).val()].callingCodes.length === 1) {
                $("#callingCode p").html(countries[$(this).val()].callingCodes);
            }

            else if (countries[$(this).val()].callingCodes.length > 1) 
            {
                $("#callingCode p").html(countries[$(this).val()].callingCodes[0]);


                for (let i = 1; i < countries[$(this).val()].timezones.length; i++) 
                {         
                    $("#callingCode p").append(`, ${countries[$(this).val()].callingCodes[i]}`);  
                }
            }

            $("#flag img").attr("src", countries[$(this).val()].flag).attr("alt", countries[$(this).val()].name)


            countryLat = countries[$(this).val()].latlng[0];
            countryLng = countries[$(this).val()].latlng[1];
            initMap();


            let splittedCapitalName = countries[$(this).val()].capital.replace(" ", "+");
            

            $.get(`http://api.openweathermap.org/data/2.5/weather?q=${splittedCapitalName}&appid=f85caa72aa1c1a98b4e73db570a65afc`
            ,function (weatherInfo) 
            {
                $(".weatherContainer:nth-child(2) p.weatherInfo").html(weatherInfo.wind.speed);
                $(".weatherContainer:nth-child(3) p.weatherInfo").html(`${weatherInfo.main.temp} F`);
                $(".weatherContainer:nth-child(4) p.weatherInfo").html(`${weatherInfo.main.humidity}%`);

                console.log(weatherInfo.visibility);
                
                if (typeof(weatherInfo.visibility) !== 'undefined') {
                    $(".weatherContainer:nth-child(5) p.weatherInfo").html(`${weatherInfo.visibility}m`);
                }
                
                else {
                    $(".weatherContainer:nth-child(5) p.weatherInfo").html("---");
                }
                
            });
        });
        
    });
   
    
});

 // Initialize and add the map
 function initMap() 
 {
     // The location of Uluru
     var countryName = { lat: countryLat, lng: countryLng };

     // The map, centered at Uluru
     var location = new google.maps.Map(
         document.getElementById('location'), { zoom: 4, center: countryName });
         
     // The marker, positioned at Uluru
     var marker = new google.maps.Marker({ position: countryName, map: location });
 }
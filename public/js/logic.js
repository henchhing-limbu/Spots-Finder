const navigator = require('navigator');
const geocoding = require('reverse-geocoding');

// global variables
const num_table_entries = 10;
const col_names = ["parkingLot", "parkingSpot"];

/**
 * Adding function to request user location from within the browser. 
 */

window.onload = function () {
    var geoOptions = {
        timeout: 10 * 1000 // 10 seconds timeout. 
    }

    var geoSuccess = function (position) {
        var config = {
            'latitude': position.coords.latitude,
            'longitude': position.coords.longitude
        };
        geocoding.location(config, (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                document.getElementById('usr-addr').value = data.formattedAddress;
            }
        })
    }

    var geoError = function (error) {
        console.log("Error when requesting user location. Error code:  " + error);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
    }
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
}

function findParkingSpot() {
    var usr_input = document.getElementById("usr-addr").value;
    if (usr_input == "") {
        swal("Error!", "There is no input address", 'error');
    }
    else {
        // Parse user address to latitude and longitude. 
        var geocodeXHR = new XMLHttpRequest();
        geocodeXHR.onreadystatechange = function (req) {
            let response = JSON.parse(req.target.response);
            let lat_lng = response.results[0].locations[0].latLng;
            const Location = {
                latitude: lat_lng.lat,
                longitude: lat_lng.lng
            };
            var newXHR = new XMLHttpRequest();
            newXHR.onreadystatechange = function (req) {
                if (this.readyState == 4 && this.status == 200) {
                    let res = JSON.parse(req.target.response);
                    console.log(res[0]);
                    update_table(res);
                }
            };
            // send a get request to server with the address attached
            newXHR.open("GET", "getspot/" + Location.latitude + "/" + Location.longitude, true);
            newXHR.send();
        }
        geocodeXHR.open("GET", 'https://www.mapquestapi.com'
            + '/geocoding/v1/address?key=6brQcu0CvLj7baidA9DquRvg663c91RT&location='
            + encodeURI(usr_input));
        geocodeXHR.send();
    }
}

// updates the html page with a table that has nearest parking spots available
function update_table(res) {
    let head = "";
    head += '<tr><th scope="col">#</th><th scope="col">Parking Lot</th>';
    head += '<th scope="col">Parking Spot</th></tr>';
    document.getElementById("table-head").innerHTML = head;

    var table_data = "";
    for (var i = 0; i < num_table_entries; i++) {
        table_data += '<tr><th scope="row">' + (i + 1) + '</th>';
        table_data += "<td>" + res[i].parkingLot + "</td>";
        table_data += "<td>" + res[i].parkingSpot + "</td>";
        table_data += "</tr>";
    }
    document.getElementById("parking-spots").innerHTML = table_data;
}

/*
function ParkingSpotLocation(location) {
    this.parkingLot = location.parkingLot;
    this.parkingSpot = location.parkingSpot;
    this.latitude = location.latitude;
    this.longitude = location.longitude;
    this.status = location.status;

    this.getLocationDictionary = function () {
        return { latitude: this.latitude, longitude: this.longitude };
    };
}

function Response(res) {
    this.location = res.location;
    this.parkingInfo = new ParkingSpotLocation(res.parkingInfo);
}
*/
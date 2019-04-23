// global variables
const num_table_entries = 10;
const col_names = ["parkingLot", "parkingSpot"];
let Location = null;
let count = 0;

window.onload = function() {
    setInterval(getInput, 5000);
}

function getInput() {
    if (Location != null) {
        getParkingSpots(Location);
        count += 1;
        console.log("Count " + count)
    }
}

// Find's parking spot available based on devices location
function getDevLoc() {
    console.log("called getDevLoc()");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition);
    } else {
        swal("Error!", "Geolocation is not supported by the browser!", "error");
    }
}

// gets latitude and longitude of user's device location
function getPosition(position) {
    console.log("called getPosition");
    Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };
}

// gets user location latitude and longitude based on input address
function getUserLoc() {
    let usr_input = document.getElementById("usr-addr").value;
    if (usr_input == "") {
        swal("Error!", "There is no input address", 'error');
    }
    else {
        // Parse user address to latitude and longitude. 
        let geocodeXHR = new XMLHttpRequest();
        geocodeXHR.onreadystatechange = function (req) {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(req.target.response);
                console.log(response);
                let lat_lng = response.results[0].locations[0].latLng;
                Location = {
                    latitude: lat_lng.lat,
                    longitude: lat_lng.lng
                };
            }
        }
        geocodeXHR.open("GET", 'https://www.mapquestapi.com' 
            + '/geocoding/v1/address?key=6brQcu0CvLj7baidA9DquRvg663c91RT&location='
            + encodeURI(usr_input));
        geocodeXHR.send();
    }
}

// sends HTTP request to server with location
// gets JSON object with avilable parking spots
function getParkingSpots(Location) {
    console.log("called getParkingSpots");
    console.log(Location.latitude, Location.longitude);
    let newXHR = new XMLHttpRequest();
    newXHR.onreadystatechange = function (req) {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Got response from server");
            console.log(req.target.response);
            let res = JSON.parse(req.target.response);
            console.log(res[0]);
            update_table(res);
        }
        else
        {
            console.log(req);
        }
    };
    // send a get request to server with the address attached
    newXHR.open("GET", "getspot/" + Location.latitude + "/" + Location.longitude, true);
    newXHR.send();
}


// updates the html page with a table that has nearest parking spots available
function update_table(res) {
    let head = "";
    head += '<tr><th scope="col">#</th><th scope="col">Parking Lot</th>';
    head += '<th scope="col">Parking Spot</th>';
    head += '<th scope="col">Address</tr>';
    document.getElementById("table-head").innerHTML = head;

    var table_data = "";
    for (var i = 0; i < num_table_entries; i++) {
        table_data += '<tr><th scope="row">' + (i + 1) + '</th>';
        table_data += "<td>" + res[i].parkingLot + "</td>";
        table_data += "<td>" + res[i].parkingSpot + "</td>";
        table_data += "<td>" + res[i].address + "</td>";
        table_data += "</tr>";
    }
    document.getElementById("parking-spots").innerHTML = table_data;
}
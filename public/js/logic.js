// global variables
const num_table_entries = 5;
// TODO: needs to be updated
const col_names = ["fname", "lname"];

function findParkingSpot() {
    console.log("Hello world");
    var usr_input = document.getElementById("usr-addr").value;
    
    if (usr_input == "") {
        swal("Error!", "There is no input address", 'error');
    }
    else {
        // Parse user address to latitude and longitude. 
        var newXHR = new XMLHttpRequest();
        newXHR.onreadystatechange = function (req) {
            if (this.readyState == 4 && this.status == 200) {
                // TODO:
                // res must be checked if the address was indeed valid address
                alert("Received status 200 message from server");
                let a = JSON.parse(req.target.response);
                // a.foreach(response => new Response(response));
                console.log(a);
                // var res = JSON.parse(req.target.response);
                // res = JSON.parse(res);
                // update_table(res);
            }
        };
        let lat = 12.1;
        let lng = 13.2;
        // send a get request to server with the address attached
        newXHR.open("GET", "getspot/" + lat + "/" + lng, true);
        newXHR.send();
    }
}

// updates the html page with a table that has nearest parking spots available
function update_table(res) {
    document.getElementById("title").innerText = "Available Parking Spot";
    var table_data = "";
    for (var i = 0; i < num_table_entries; i++) {
        table_data += "<tr>";
        for (var col_name in res) {
            // swal("Success!", res[col_name][0], "success");
            table_data += "<td>" + res[col_name][i] + "</td>";
        }
        table_data += "</tr>";
    }
    document.getElementById("parking-spots").innerHTML = table_data;
}

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
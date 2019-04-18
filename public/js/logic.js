// global variables
const num_table_entries = 5;
// TODO: needs to be updated
const col_names = ["fname", "lname"];

function findParkingSpot() {
    var usr_input = document.getElementById("usr-addr").value;
    if (usr_input == "") {
        swal("Error!", "There is no input address", 'error');
    }
    else {
        // creat new http request
        var newXHR = new XMLHttpRequest();
        newXHR.onreadystatechange = function(req) {
            if (this.readyState == 4 && this.status == 200) {
                // TODO:
                // res must be checked if the address was indeed valid address
                var res = JSON.parse(req.target.response);
                res = JSON.parse(res);
                update_table(res);
            }
        };
        // send a get request to server with the address attached
        newXHR.open("GET", "getspot?addr=" + usr_input, true);
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
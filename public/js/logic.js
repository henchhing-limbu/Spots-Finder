function findParkingSpot() {
    var usr_input = document.getElementById("usr-addr").value;
    if (usr_input == "") {
        swal("Error!", "There is no input address", 'error');
    }
    else {
        // TODO: GET THE input
        // TODO: cloud function to make query to the databse

        /*
        var newXHR = new XMLHttpRequest();
        newXHR.addEventListener("load",reqListener);
        newXHR.open("POST","/import");
        newXHR.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    
        //Data for POST
        var JSONObj = {};
        JSONObj.address = usr_input;
        console.log(JSONObj);
        //Format Data for POST
        var POSTData = JSON.stringify(JSONObj);
        newXHR.send(POSTData);
        */
    }
}

function reqListener(req) {
    var res = JSON.parse(req.target.response);
    console.log(res);
    if (res.status=="OK") {
        swal("Success!", "Succesfully Sent & Retrieved Data :\n", 'success');
    }
    else if (res.status=="ERROR") {
        swal("Error!", "The server received unexpected data or is missing important parameters", "error");
    }
    else {
        swal("Error!", "Unexcpected Error!", "error");
    }
}
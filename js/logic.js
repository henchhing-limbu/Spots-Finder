function findParkingSport() {
    var usr_input = document.getElementById("usr-addr").value;
    if (usr_input == "") {
        swal("Error!", "There is no input address", 'error');
    }
    // TODO: send get request to the server
    else {
        alert("There is input");
    }
}
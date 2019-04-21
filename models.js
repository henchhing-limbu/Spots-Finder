exports.ParkingSpotRequest = function (request) {
    this.name = request.name;
    this.vehicleId = request.vehicleId;
    this.parkingLot = request.parkingLot;
    this.ParkingSpot = request.ParkingSpot;
    this.timeRequested = request.timeRequested;
}


exports.ParkingSpotLocation = function (location) {
    this.parkingLot = location.parkingLot;
    this.parkingSpot = location.parkingSpot;
    this.latitude = location.latitude;
    this.longitude = location.longitude;
    this.status = location.status;

    this.getLocationDictionary = function () {
        return { latitude: this.latitude, longitude: this.longitude };
    };
}

exports.Location = function (latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;

    this.getLocationDictionary = function () {
        return { latitude: this.latitude, longitude: this.longitude };
    };
}
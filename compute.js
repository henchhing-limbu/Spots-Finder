const geolib = require("geolib");
const Knex = require('knex');
const navigator = require("navigator");

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

function Location(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;

    this.getLocationDictionary = function () {
        return { latitude: this.latitude, longitude: this.longitude };
    };
}

exports.findNearestParkingSpot = function (userLocation, config) {
    // Connect to the Cloud SQL database. 
    // SQL query for all the parking spots which is available. 
    // Use geolib to find the nearest spot. 
    // Return the geolib object. 

    const user_location = new Location(userLocation.latitude, userLocation.longitude);

    // Connect to the database
    const knex = Knex({
        client: 'mysql',
        connection: config
    });

    return getParkingSpots(knex).then(parkingSpots => {
        var parkingLotsOrderedByDistance = geolib.orderByDistance(user_location.getLocationDictionary(), parkingSpots.map(spot => spot.getLocationDictionary())).slice(0, 10);
        console.log(parkingLotsOrderedByDistance);
        return parkingLotsOrderedByDistance.map(a => parkingSpots[a.key]);
        // return parkingLotsOrderedByDistance.map(parkingLot => getParkingLotInformationForFrontend(parkingSpots, parkingLot));
    })
    .catch(err => {
      console.log(err);
    });
}

function getParkingLotInformationForFrontend(parkingSpots, parkingLot) {
    return {
        distance: parkingLot.distance,
        parkingInfo: parkingSpots[parkingLot.key]
    };
}

function getParkingSpots(knex) {
    return knex.select('parkingLot', 'parkingSpot', 'latitude', 'longitude', 'status').
        from('parkingDataTable2').
        where({ status: 'Empty' }).
        then((results) => {
            return results.map(location => new ParkingSpotLocation(location));
        });
}
var x = geolib.getDistanceSimple(
    { latitude: 51.5103, longitude: 7.49347 },
    { latitude: "51° 31' N", longitude: "7° 28' E" }
);

console.log(x);
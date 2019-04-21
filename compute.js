const geolib = require("geolib");
const Knex = require('knex');
const navigator = require("navigator");
const models = require('./models.js');

// Authentication for cloud SQL. 
const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
};

// Connect to the database
const knex = Knex({
    client: 'mysql',
    connection: config
});

/**
 * Makes SQL query to find all Empty parking spots, and uses the geeolib library
 * to find the nearest parking spot. 
 * @param {*} userLocation Location to use as reference point to find nearest parking spot. 
 * @param {*} config Database config object to connect to the database. 
 */
exports.findNearestParkingSpot = function (userLocation, config) {

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
                return results.map(location => new models.ParkingSpotLocation(location));
            });
    }

    const user_location = new models.Location(userLocation.latitude, userLocation.longitude);

    return getParkingSpots(knex).then(parkingSpots => {
        var parkingLotsOrderedByDistance = geolib.orderByDistance(
            user_location.getLocationDictionary(),
            parkingSpots.map(
                spot => spot.getLocationDictionary())).slice(0, 10);
        return parkingLotsOrderedByDistance.map(parkingLot => getParkingLotInformationForFrontend(parkingSpots, parkingLot));
    })
        .catch(err => {
            console.log(err);
        });
}

/**
 * Checks if the parking spot requested is still available, 
 *  If true, updates the status to 'Occupied' and updates the occupiedUntil field. 
 * Else, returns an error response. 
 * @param {*} parkingSpotRequest Request object that contains information about the user and the parking spot to book. 
 */
exports.bookParkingSpot = function (parkingSpotRequest) {

    /**
 * Additonal function to add two date objects. 
 */
    Date.prototype.addHours = function (hours) {
        this.setTime(this.getTime() + hours * 60 * 60 * 1000);
        return this;
    }

    function isParkingSpotAvailable(parkingSpotRequest) {
        return knex.select('parkingLot', 'parkingSpot', 'status')
            .from('parkingDataTable2')
            .where({
                parkingLot: parkingSpotRequest.parkingLot,
                parkingSpot: parkingSpotRequest.parkingSpot
            });
    }

    function makeReservation(parkingSpotRequest) {
        return knex('parkingDataTable2')
            .where({
                parkingLot: parkingSpotRequest.parkingLot,
                parkingSpot: parkingSpotRequest.parkingSpot
            })
            .update({
                status: 'Occupied',
                occupiedUntil: Date().addHours(parkingSpotRequest.timeRequested)
            });
    }

    return new Promise((resolve, reject) => {
        isParkingSpotAvailable(parkingSpotRequest)
            .then(parkingSpotInfo => {
                if (parkingSpotInfo.status == 'Occupied') {
                    reject('Error: Parking Spot already booked');
                }
                return parkingSpotRequest;
            })
            .then(parkingSpotRequest => {
                return makeReservation(parkingSpotRequest);
            });
    })
}
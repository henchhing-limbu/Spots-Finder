const geolib = require("geolib");
const navigator = require("navigator");
var x = geolib.getDistanceSimple(
    { latitude: 51.5103, longitude: 7.49347 },
    { latitude: "51° 31' N", longitude: "7° 28' E" }
);

console.log(x);
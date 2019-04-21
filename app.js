'use strict';
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const compute = require('./compute.js');
const models = require('./models.js');
const process = require('process');

const app = express();
app.enable('trust proxy');
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.json());

if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

app.get('/', (req, res) => {
    res.redirect('/request.html');
});

app.get('/getspot/:lat/:lng', (req, res) => {
    const userLocation = {
        latitude: req.params.lat,
        longitude: req.params.lng
    };
    compute.findNearestParkingSpot(userLocation, config).then(result => {
        res.status(200).send(JSON.stringify(result));
    });
});

app.post('/reserve/:parkingLot/:parkingSpot', (req, res) => {
    // Parse user information from the body of the message. 
    // Use the information to make reservation. 
    /*
    Sample POST Request body: 
    {
        "name": "John Doe",
        "vehicleId": "5T765",
        "parkingLot": 1365,
        "parkingSpot": 12
        "timeRequested": 1.5 // Time requested is in hours. 
    } 
    */

    console.log(req.body);
    const parkingRequest = new models.ParkingSpotRequest(req.body);
    compute.bookParkingSpot(parkingRequest).then(result => {
        res.status(200).send(JSON.stringify(result))
    }).catch(error => {
        // Send error response code with the message. 
    })


})

app.get('/request.html', (req, res) => {
    res
        .status(200)
        .sendFile(path.join(__dirname, 'public', 'html', 'request.html'));
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log('App listening on port ${PORT}');
    console.log('Press Ctrl+C to quit.');
});

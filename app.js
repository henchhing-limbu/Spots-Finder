'use strict';
const express = require('express');
const path = require('path');
const compute = require('./compute.js');
const process = require('process');

const app = express();
app.enable('trust proxy');
app.use(express.static(__dirname + '/public'));

// Authentication for cloud SQL. 
const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
};

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
    })
    .catch(error => {
        console.log(error);
        res.status(400).send(JSON.stringify(error));
    });
    // res.status(200).send('some text');

});

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

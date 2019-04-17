'use strict';

const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res
        .status(200)
        .sendFile(path.join(__dirname, 'public', 'html', 'request.html'));
});

// handles get request from the client
app.get('/getspot', (req, res) => {
    
    //TODO: 
    // send a json file with availbale parking spots
    var parking_spots = {
        "fname": ["henchhing", "aayush", "kaleshwar", "zaykha", "biswash"],
        "lname": ["limbu", "gupta", "singh", "kyaw san", "adhikari"]
    }
    var json_data = JSON.stringify(parking_spots);
    res
        .status(200)
        .json(json_data);
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log('App listening on port ${PORT}');
    console.log('Press Ctrl+C to quit.');
});
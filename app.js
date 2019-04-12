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
app.get('/request.html', (req, res) => {
    res
        .status(20)
        .sendFile(path.join(__dirname, 'public', 'html', 'request.html'));
})
app.get('/response.html', (req, res) => {
    // TODO: need to query the database 
    // Need to get parking spots
    res
        .status(200)
        .sendFile(path.join(__dirname, 'public', 'html', 'response.html'));
})

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log('App listening on port ${PORT}');
    console.log('Press Ctrl+C to quit.');
});
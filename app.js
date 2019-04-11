'use strict';

const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res
        .status(200)
        .send('hello world!')
        .end();
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log('App listening on port ${PORT}');
    console.log('Press Ctrl+C to quit.');
});

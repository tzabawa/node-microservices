const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {});

app.listen(4003, () => {
    console.log('Listening on port 4003');
});
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const { body: event } = req;

    console.log('Event bus endpoint hit!');

    try {
        await Promise.all([
            axios.post('http://localhost:4000/events', event),
            axios.post('http://localhost:4001/events', event),
            axios.post('http://localhost:4002/events', event)
        ])

        res.send({status: 'OK'});
    } catch (error) {
        console.log('Error: ', error);
        res.send({status: 'ERROR', error});
    }   
});

app.listen(4005, () => {
    console.log('Listening on port 4005');
})
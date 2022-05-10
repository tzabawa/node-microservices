const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.get('/events', async (req, res) => {
    res.send(events);
});

app.post('/events', async (req, res) => {
    const { body: event } = req;

    try {
        events.push(event);

        await Promise.all([
            axios.post('http://posts-clusterip-srv:4000/events', event),
            axios.post('http://comments-srv:4001/events', event),
            axios.post('http://query-srv:4002/events', event),
            axios.post('http://moderation-srv:4003/events', event)
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
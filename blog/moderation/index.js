const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    try {
        const { body: { data: {content, id, postId}, type } } = req;

        if (type === 'CommentCreated') {
            const status = content.includes('orange') ? 'rejected' : 'approved';

            await axios.post('http:/event-bus-srv:4005/events', {type: 'CommentModerated', data: {content, id, postId, status }});
        }

        res.send({});
    } catch (error) {
        console.log('Error: ', error);
        res.send({status: 'ERROR', error});
    }
});

app.listen(4003, () => {
    console.log('Listening on port 4003');
});
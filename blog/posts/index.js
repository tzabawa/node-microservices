const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const  { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.post('/posts/create', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {id, title};

    await axios.post('http://event-bus-srv:4005/events', {type: 'PostCreated', data: {id, title}});

    res.status(200).send(posts[id]);
});

app.post('/events', async (req, res) => {
    console.log('Received event: ', req.body.type);
    res.send({})
});

app.listen(4000, () => {
    console.log('Listening on port 4000');
})
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', async (req, res) => {
    const { body: { type, data } } = req;

    handleEvent(type, data);

    res.send({});
});

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;
        
        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        
        post.comments.push({ id, content, status });
    }

    if (type === 'CommentUpdated') {
        const {id, content, postId, status } = data;

        const post = posts[postId];
        const comment = post.comments.find((comment) => comment.id === id);
        
        comment.content = content;
        comment.status = status;
    }
}

app.listen(4002, async () => {
    console.log('Listening on port 4002');

    try {
        const res = await 'http://event-bus-srv:4005/events';

        for (let event of res.data) {
            console.log('Processing event: ', event.type);
            handleEvent(event.type, event.data);
        }
    } catch (error) {
        console.log({status: 'ERROR', messae: error.message});
    }
})
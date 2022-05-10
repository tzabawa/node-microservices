const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const  { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    const { params: { id }} = req;
    const comments = commentsByPostId[id] || [];
    res.send(comments);
});

app.post('/posts/:id/comments', async (req, res) => {
    const { params: { id }} = req;
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[id] || [];
    comments.push({id: commentId, content, status: 'pending' });

    commentsByPostId[id] = comments;

    await axios.post('http://event-bus-srv:4005/events', {type: 'CommentCreated', data: {id: commentId, content, postId: id, status: 'pending' }});

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    const { body: { data, type }} = req;

    if (type === 'CommentModerated') {
        try {
            const { content, id, postId, status } = data;
        
            const comments = commentsByPostId[postId];
            const comment = comments.find((comment) => comment.id = id);
            comment.status = status;

            await axios.post('http://event-bus-srv:4005/events', {type: 'CommentUpdated', data: {id, content, postId, status }});
        } catch (error) {
            console.log('Error: ', error);
            return res.send({status: 'ERROR', error});
        }
    }
    res.send({})
});

app.listen(4001, () => {
    console.log('Listening on port 4001');
})
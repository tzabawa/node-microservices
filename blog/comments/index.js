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

app.post('/posts/:id/comments', (req, res) => {
    const { params: { id }} = req;
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[id] || [];
    comments.push({id: commentId, content });

    commentsByPostId[id] = comments;

    res.status(201).send(comments);
});

app.listen(4001, () => {
    console.log('Listening on port 4001');
})
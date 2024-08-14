const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const options = { /* ... */ };
const apiRouter = require('./routes/api');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const app = express();
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

const server = require('http').createServer(app);
const io = require('socket.io')(server, options);

mongoose.set('strictQuery', true);

mongoose.connect(
    process.env.MongoURI,
    // 'mongodb://127.0.0.1:27017/mosque',
    { useNewUrlParser: true })
    .then(() => {
        console.log('Connexion réussie à la base de données');
    })
    .catch((error) => {
        console.log(`Erreur de connexion à la base de données : ${error}`);
    });

io.on('connection', (socket) => {
    console.log('user connected', socket.id);
    socket.on('joinLesson', async (lessonId) => {
        socket.join(lessonId);
        console.log(`user joined lesson ${lessonId}`);
    });
    socket.on('leaveLesson', (lessonId) => {
        socket.leave(lessonId);
        console.log(`user left lesson ${lessonId}`);
    });
    socket.on('newComment', async (data) => {
        const { lessonId, comment, user, createdAt } = data;
        const newComment = { user, comment, createdAt };
        console.log(newComment);
        io.to(lessonId).emit('newComment', newComment);
    });
    socket.on('disconnect', () => {
        console.log('socket disconnect');
    });
});

app.use('/api', apiRouter);

server.listen(PORT, () => {
    console.log('Server started on port 3000');
});

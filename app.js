const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');//installer le module mongoose (avant vous devez installer et configurer Mongodb)
const options = { /* ... */ };
const apiRouter = require('./routes/api');

require('dotenv').config()

const app = express();
var cors = require('cors')
app.use(cors())
app.use(bodyParser.json());

const server = require('http').createServer(app);
const io = require('socket.io')(server, options);
app.use(bodyParser.json());
// Connexion à la base de données MongoDB
mongoose.set('strictQuery', true);

mongoose.connect('mongodb://127.0.0.1:27017/mosque', { useNewUrlParser: true })
    .then(() => {
        console.log('Connexion réussie à la base de données');

    })
    .catch((error) => {
        console.log(`Erreur de connexion à la base de données : ${error}`);
    });


io.on('connection', (socket) => {
    console.log('user connected');
    console.log('socket id', socket.id);

    socket.on('disconnect', () => {
        console.log('socket disconnect ')
    });
});
app.use('/api', apiRouter);
server.listen(3000, () => {
    console.log('Server started on port 3000');
});
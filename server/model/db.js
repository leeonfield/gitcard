const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/comment');

const db = mongoose.connection;
db.on('error', async () => {
    console.error.bind(console, 'connection error')
});
db.on('open', async () => {
    console.log("MongoDB open success !");
});

module.exports = mongoose;

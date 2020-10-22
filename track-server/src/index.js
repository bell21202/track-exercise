require('./models/User');
require('./models/Track');
const express = require('express'); // this is an import
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const requireAuth = require('./middlewares/requireAuth');
const trackRoutes = require('./routes/trackRoutes');

const app = express();

app.use(bodyParser.json()); // incoming json data out of requests
app.use(authRoutes); // configure this app to use our route handlers
app.use(trackRoutes);

const mongoUri = 'mongodb+srv://admin:passwordpassword@cluster0.4kbvc.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err);
});


app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
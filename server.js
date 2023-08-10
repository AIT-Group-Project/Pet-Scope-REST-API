// Imports
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const verifyJWT = require('./middleware/verifyJWT');
const PORT = process.env.PORT || 3500;

// Express Application Setup
app.use(cors(corsOptions));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());


// API ENDPOINTS
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));

app.use(verifyJWT); // verification middleware - endpoints listed below will use this and require a user to be authenticated before being able to access these endpoints

// All undefined endpoints return a 404 status and html page
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({'error': '404 Not Found'});
    } else {
        res.type('txt').send('404 Not Found');
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
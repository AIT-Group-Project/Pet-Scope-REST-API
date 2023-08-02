require('dotenv').config();

let express = require('express');
let app = express();
let path = require('path');
let cors = require('cors');
let corsOptions = require('./config/corsOptions');

let cookieParser = require('cookie-parser');

let PORT = process.env.PORT || 3500;

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


// API ENDPOINTS
app.use('/', require('./routes/root'));
app.use('/auth', require('./routes/auth'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
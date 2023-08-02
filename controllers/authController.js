let jwt = require('jsonwebtoken');
let sql = require('mssql');
let config = require('../config/dbconfig');

let handleLogin = async (req, res) => {
    // write code here to handle login
    let { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and Password are requried'});
    }
    // let pool = await sql.connect(config);
    // res.sendStatus(200);
}

module.exports = { handleLogin };
// const jwt = require('jsonwebtoken');
const sql = require('mssql');
const config = require('../config/dbconfig');

const handleLogin = async (req, res) => {
    // write code here to handle login
    const {email, password} = req.body;
    if (!email || !password) return res.status(400).json({'message': 'Email and Password are required'});

    const pool = await sql.connect(config);
    const checkForUser = await pool.request()
        // eslint-disable-next-line new-cap
        .input('sql_email', sql.NVarChar(255), email)
        .query('SELECT email FROM vetdata.users WHERE email = @sql_email');

    if (checkForUser.recordset[0] == undefined) return res.status(400).json({'message': `No User Exists with this email: ${email}`});

    return res.status(200).json(checkForUser.recordset[0]);
};

module.exports = {handleLogin};

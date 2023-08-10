/* eslint-disable new-cap */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const config = require('../config/dbconfig');

const handleLogin = async (req, res) => {
    // checks if the req has the correct data to action a auth request
    const {email, password} = req.body;
    if (!email || !password) return res.status(400).json({'message': 'Email and Password are required'});

    // connect to the database and query for users: id, email, password_hash where req: email = database: email
    const pool = await sql.connect(config);
    const checkForUser = await pool.request()
        .input('sql_email', sql.NVarChar(255), email)
        .query('SELECT u.user_id, u.email, a.password_hash FROM vetdata.users u INNER JOIN vetdata.dim_authentication a ON u.user_id = a.user_id AND u.email = @sql_email');

    // checks if the returned query is defined (undefined query result = no record in the database matching req: email)
    if (checkForUser.recordset[0] == undefined) return res.status(400).json({'message': `No User Exists with this email: ${email}`});

    // comparing req: password to database: password_hash returning true/false
    const isMatch = await bcrypt.compare(password, checkForUser.recordset[0].password_hash);

    if (isMatch) {
        // create jwt accessToken, refreshToken using database: user_id, email
        const accessToken = jwt.sign(
            {
                'UserInfo': {
                    'user_id': checkForUser.recordset[0].user_id,
                    'email': checkForUser.recordset[0].email,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '10s'}, // increase this to 15 mins in prod
        );
        const refreshToken = jwt.sign(
            {'email': checkForUser.recordset[0].email},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'},
        );

        // storing accessToken, refreshToken in database
        await pool.request()
            .input('sql_uid', sql.Int, checkForUser.recordset[0].user_id)
            .input('sql_refreshToken', sql.NVarChar(255), refreshToken)
            .query('UPDATE vetdata.dim_authentication SET refreshToken = @sql_refreshToken WHERE user_id = @sql_uid;');

        // send accessToken, refreshToken in res
        res.cookie('jwt', refreshToken, {httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000});
        res.json({accessToken});
    } else {
        res.sendStatus(401);
    }
};

module.exports = {handleLogin};

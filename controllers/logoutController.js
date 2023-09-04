/* eslint-disable new-cap */
const sql = require('mssql');
const config = require('../config/dbconfig');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    // checks if the req has the correct data(cookie) to action a logout req
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    try {
        // remove refreshToken from database & cookie
        const pool = await sql.connect(config);
        await pool.request()
            .input('sql_refreshToken', sql.NVarChar(255), refreshToken)
            .query('UPDATE vetdata.dim_authentication SET refreshToken = NULL WHERE refreshToken = @sql_refreshToken');

        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({'message': err.message});
    };

};

module.exports = {handleLogout};
/* eslint-disable new-cap */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const config = require('../config/dbconfig');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401);
    const refreshToken = cookies.jwt;

    const pool = await sql.connect(config);
    const checkForUsersRefreshToken = await pool.request()
        .input('sql_refreshToken', sql.NVarChar(255), refreshToken)
        .query('SELECT u.user_id, u.email FROM vetdata.users u INNER JOIN vetdata.dim_authentication a ON u.user_id = a.user_id and a.refreshToken = @sql_refreshToken');

    if (checkForUsersRefreshToken.recordset[0] == undefined) return res.status(401);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || checkForUsersRefreshToken.recordset[0].email !== decoded.email) return res.sendStatus(403);
            const accessToken = jwt.sign(
                {
                    'UserInfo': {
                        'user_id': checkForUsersRefreshToken.recordset[0].user_id,
                        'email': decoded.email,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '10s'},
            );
            res.json({accessToken});
        },
    );
};

module.exports = {handleRefreshToken};

/* eslint-disable new-cap */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const config = require('../config/dbconfig');

const handleRefreshToken = async (req, res) => {
    // checks if the req has the correct data to action a refresh request
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    try {
        // connect to the database and query for users: id, email where req: refreshToken = database: refreshToken
        const pool = await sql.connect(config);
        const checkForUsersRefreshToken = await pool.request()
            .input('sql_refreshToken', sql.NVarChar(255), refreshToken)
            .query('SELECT u.user_id, u.email FROM vetdata.users u INNER JOIN vetdata.dim_authentication a ON u.user_id = a.user_id and a.refreshToken = @sql_refreshToken');

        // checks if the returned query is defined (undefined query result = no record in the database matching req: refreshToken)
        if (checkForUsersRefreshToken.recordset[0] == undefined) return res.sendStatus(403);

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
                    {expiresIn: '10s'}, // increase this to 15 mins in prod
                );
                res.json({accessToken});
            },
        );
    } catch (err) {
        res.status(500).json({'message': err.message});
    };
        
};

module.exports = {handleRefreshToken};

/* eslint-disable camelcase */
const sql = require('mssql');
const config = require('../config/dbconfig');

const handleUsers = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const response = await pool.request()
            .query('SELECT user_id, first_name, last_name FROM vetdata.users');
        return res.status(200).json(...response.recordsets);
    } catch (err) {
        return res.status(500).json({'message': err.message });
    }
}

module.exports = {handleUsers};
/* eslint-disable camelcase */
const sql = require('mssql');
const config = require('../config/dbconfig');

const handleUsers = async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const response = await pool.request()
            .query("SELECT user_id, first_name, last_name, pet_breed FROM vetdata.users WHERE dog_cat = 'dog'");
        return res.status(200).json(...response.recordsets);
    } catch (err) {
        return res.status(500).json({'message': err.message });
    }
}

const handleUsersInfo = async (req, res) => {
    if (!req?.params?.userId) return res.status(400).json({ 'message': 'Employee User ID required.' });
    
    const userId = req?.params?.userId;
    //console.log(userId) debugging
    try {
        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('sql_user_id', sql.Int, userId)
            .query('SELECT * FROM vetdata.users WHERE user_id = @sql_user_id');
        return res.status(200).json(...response.recordsets);
    } catch (err) {
        return res.status(500).json({'message': err.message });
    }
}

module.exports = {
    handleUsers,
    handleUsersInfo
};
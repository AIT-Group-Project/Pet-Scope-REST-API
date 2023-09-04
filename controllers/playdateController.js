/* eslint-disable camelcase */
const sql = require('mssql');
const config = require('../config/dbconfig');

const handlePlayDate = async (req, res) => {
    const {sender, receiver, date, time} = req.body; // update to remove snake_case from const names request json will need to match
    if (!sender || !receiver || !date || !time) return res.status(400).json({'message': 'Invalid playdate request'});
    try {
        const pool = await sql.connect(config);
        pool.request()
            .input('sql_sender_user_id', sql.Int, sender)
            .input('sql_receiver_user_id', sql.Int, receiver)
            .input('sql_play_date', sql.Date, date)
            .input('sql_play_time', sql.NVarChar, time)
            .query('INSERT INTO vetdata.dim_playdates VALUES (@sql_sender_user_id, @sql_receiver_user_id, @sql_play_date, @sql_play_time, NULL)');
    
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
};

module.exports = {handlePlayDate};
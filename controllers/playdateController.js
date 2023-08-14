/* eslint-disable camelcase */
const sql = require('mssql');
const config = require('../config/dbconfig');

const handlePlayDate = async (req, res) => {
    const {sender_user_id, receiver_user_id, play_date, play_time} = req.body;
    if (!sender_user_id || !receiver_user_id || !play_date || !play_time) return res.status(400).json({'message': 'Invalid playdate request'});

    const pool = await sql.connect(config);
    pool.request()
        .input('sql_sender_user_id', sql.Int, sender_user_id)
        .input('sql_receiver_user_id', sql.Int, receiver_user_id)
        .input('sql_play_date', sql.Date, play_date)
        .input('sql_play_time', sql.NVarChar, play_time)
        .query('INSERT INTO vetdata.dim_playdates VALUES (@sql_sender_user_id, @sql_receiver_user_id, @sql_play_date, @sql_play_time)');

    return res.sendStatus(200);
};

module.exports = {handlePlayDate};
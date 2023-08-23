/* eslint-disable camelcase */
const sql = require('mssql');
const config = require('../config/dbconfig');

const handlePlayDate = async (req, res) => {
    const {senderUserId, receiverUserId, playDate, playTime} = req.body; // update to remove snake_case from const names request json will need to match
    if (!senderUserId || !receiverUserId || !playDate || !playTime) return res.status(400).json({'message': 'Invalid playdate request'});

    const pool = await sql.connect(config);
    pool.request()
        .input('sql_sender_user_id', sql.Int, senderUserId)
        .input('sql_receiver_user_id', sql.Int, receiverUserId)
        .input('sql_play_date', sql.Date, playDate)
        .input('sql_play_time', sql.NVarChar, playTime)
        .query('INSERT INTO vetdata.dim_playdates VALUES (@sql_sender_user_id, @sql_receiver_user_id, @sql_play_date, @sql_play_time)');

    return res.sendStatus(200);
};

module.exports = {handlePlayDate};
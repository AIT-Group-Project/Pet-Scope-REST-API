/* eslint-disable camelcase */
const { response } = require('express');
const sql = require('mssql');
const config = require('../config/dbconfig');

const handlePlayDate = async (req, res) => {
    if (!req?.body) {
        return res.status(400).json({'message': 'Invalid playdate request'});
    };

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

const handlePlayDateInvite = async (req, res) =>{
    if (!req?.params?.userId) return res.status(400).json({ 'message': 'Employee User ID required.' });
    
    const CurrentUserId = req?.params?.userId;

    try {
        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('sql_current_logged_in_user_id', sql.Int, CurrentUserId)
            .query("SELECT pd.play_date_id, CONCAT(u.first_name, ' ', u.last_name) AS sender_name, CONCAT(receiver.first_name, ' ', receiver.last_name) AS receiver_name, pd.play_date, pd.play_time, pd.confirmed FROM vetdata.dim_playdates pd LEFT JOIN vetdata.users u ON pd.sender_user_id = u.user_id LEFT JOIN vetdata.users receiver ON pd.reciver_user_id = receiver.user_id WHERE pd.reciver_user_id = @sql_current_logged_in_user_id");

        return res.status(200).json(...response.recordsets);
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
};

const confirmPlayDateInvite = async (req, res) =>{
    if (!req?.body) {
        return res.status(400).json({'message': 'Invalid playdate confirm'});
    };

    const {PlayDate_ID, Confirmed} = req.body

    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('sql_PlayDate_ID', sql.Int, PlayDate_ID)
            .input('sql_confirmed', sql.NVarChar(1), Confirmed)
            .query('UPDATE vetdata.dim_playdates SET confirmed = @sql_confirmed WHERE play_date_id = @sql_PlayDate_ID')


        return res.status(200).json(response);
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
};


module.exports = {
    handlePlayDate,
    handlePlayDateInvite,
    confirmPlayDateInvite
};



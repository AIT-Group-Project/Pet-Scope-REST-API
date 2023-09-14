// const sql = require('mssql');
// const config = require('../config/dbconfig');

// const handleProfile = async (req, res) =>{
//     if (!req?.params?.userId) return res.status(400).json({ 'message': 'User ID requried.' });

//     const CurrentUserID = req?.params?.userId;

//     try {
//         const pool = await sql.connect(config);
//         const response = await pool.request()
//             .input('sql_current_logged_in_user_id', sql.Int, CurrentUserID)
//             .query('UPDATE vetdata.users SET ')
//     }
// }
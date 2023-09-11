const sql = require('mssql');
const config = require('../config/dbconfig');

const handlePlayDateInvite = async (req, res) =>{
    
    const CurrentUserId=req?.query?.userId;

    try {
        const pool = await sql.connect(config);
        const response = await pool.request()
            
            .input('sql_current_logged_in_user_id', sql.Int, CurrentUserId)
            .query('SELECT * FROM vetdata.dim_playdates WHERE reciver_user_id = @sql_current_logged_in_user_id');

            console.log(CurrentUserId)

        return res.status(200).json(...response.recordsets);
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
};

module.exports = {handlePlayDateInvite};
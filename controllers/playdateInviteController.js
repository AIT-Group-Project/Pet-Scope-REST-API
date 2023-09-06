const sql = require('mssql');
const config = require('../config/dbconfig');

const handlePlayDateInvite = async (req, res) =>{
    try {
        const pool = await sql.connect(config);
        const response = await pool.request()
            .query('SELECT * FROM vetdata.dim_playdates');
        return res.status(200).json(...response.recordsets);
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
};

module.exports = {handlePlayDateInvite};
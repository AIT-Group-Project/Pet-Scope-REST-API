/* eslint-disable new-cap */
const bcrypt = require('bcryptjs');
const sql = require('mssql');
const config = require('../config/dbconfig');

const handleNewUser = async (req, res) => {
    const {email, password, firstName, lastName} = req.body;
    if (!email || !password || !firstName || !lastName) return res.status(400).json({'message': 'Invalid Request.'});

    // check for duplicate usernames in the db
    const pool = await sql.connect(config);
    const checkForDuplicate = await pool.request()
        .input('sql_email', sql.NVarChar(255), email)
        .query('SELECT email FROM vetdata.users WHERE email = @sql_email');

    if (checkForDuplicate.recordset[0] != undefined) return res.sendStatus(409); // Conflict

    try {
        // encrypt the password
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);

        const maxUserId = await pool.request()
            .query('SELECT max(user_id) AS maxUID FROM vetdata.users');

        const maxUID = maxUserId.recordset[0].maxUID;
        const newUID = maxUID + 1;

        // create and store the new user
        await pool.request()
            .input('sql_first_name', sql.NVarChar(255), firstName)
            .input('sql_last_name', sql.NVarChar(255), lastName)
            .input('sql_email', sql.NVarChar(255), email)
            .query('INSERT INTO vetdata.users VALUES (@sql_first_name,@sql_last_name,NULL,@sql_email,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL)');

        await pool.request()
            .input('sql_UID', sql.Int, newUID)
            .input('sql_password_hash', sql.NVarChar(255), hashedPassword)
            .input('sql_password_salt', sql.NVarChar(255), salt)
            .query('INSERT INTO vetdata.dim_authentication VALUES (@sql_UID,@sql_password_hash,@sql_password_salt)');

        // const result = {
        //     'email': email,
        //     'hashedPassword': hashedPassword,
        //     'salt': salt,
        //     'firstName': firstName,
        //     'lastName': lastName,
        // };
        // console.log(result);

        res.status(201).json({'success': `New user ${email} created!`});
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
};

module.exports = {handleNewUser};
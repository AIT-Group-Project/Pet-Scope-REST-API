const { request } = require('express');
const sql = require('mssql');
const config = require('../config/dbconfig');

const handleProfile = async (req, res) => {
    const { petname, dogorcat, gender, breed, age, address, phoneNo, postcode, image, UID } = req.body;
    console.log('req.body', req.body)
    if ( !petname || !dogorcat || !postcode || !address || !age || !gender || !phoneNo || !breed || !UID || (Object.keys(image).length === 0 && image.constructor === Object)) return res.status(400).json({'message': 'Invalid Request.'});
    
    try {
        const pool = await sql.connect(config);   
        await pool.request()
            .input('sql_pet_name', sql.NVarChar(255), petname)
            .input('sql_dog_cat', sql.NVarChar(255), dogorcat)
            .input('sql_postcode', sql.NVarChar(255), postcode)
            .input('sql_suburb', sql.NVarChar(255), address)
            .input('sql_pet_age', sql.NVarChar(255), age)
            .input('sql_pet_breed', sql.NVarChar(255), breed)
            .input('sql_pet_gender', sql.NVarChar(255), gender)
            .input('sql_contact_phone_number', sql.NVarChar(255), phoneNo)
            .input('sql_user_id', sql.Int, UID);

        if (image && typeof image === 'string') {
            request.input('sql_photo_url', sql.NVarChar(255), image);
        }
        await request.query('UPDATE vetdata.users SET pet_name = @sql_pet_name, dog_cat = @sql_dog_cat, postcode = @sql_postcode, suburb = @sql_suburb, pet_age = @sql_pet_age, pet_breed = @sql_pet_breed, pet_gender = @sql_pet_gender, contact_phone_number = @sql_contact_phone_number' + (image && typeof image === 'string' ? ', photo_url =@sql_photo_url' : '') + ' WHERE user_Id = @sql_user_id')

        res.status(201).json({'success': 'Profile Updated'});
    } catch (err) {
        res.status(500).json({'message': err.message});
    };



}

module.exports = {handleProfile}

const { request } = require('express');
const sql = require('mssql');
const config = require('../config/dbconfig');
const path = require('path');

const assetsFolder = path.join(__dirname, 'assets');

const handleProfile = async (req, res) => {
    console.log('req.files', req.files);
    const { petname, dogorcat, gender, breed, age, suburb, phoneNo, postcode, UID } = req.body;
    console.log('req.body', req.body)
     //if ( !petname || !dogorcat || !postcode || !suburb || !age || !gender || !phoneNo || !breed || !UID) return res.status(400).json({'message': 'Invalid Request.'});
    
    try {
        const pool = await sql.connect(config);   
        await pool.request()
            .input('sql_pet_name', sql.NVarChar(255), petname)
            .input('sql_dog_cat', sql.NVarChar(255), dogorcat)
            .input('sql_postcode', sql.NVarChar(255), postcode)
            .input('sql_suburb', sql.NVarChar(255), suburb)
            .input('sql_pet_age', sql.NVarChar(255), age)
            .input('sql_pet_breed', sql.NVarChar(255), breed)
            .input('sql_pet_gender', sql.NVarChar(255), gender)
            .input('sql_contact_phone_number', sql.NVarChar(255), phoneNo)
            .input('sql_user_id', sql.Int, UID)
            .query('UPDATE vetdata.users SET pet_name = @sql_pet_name, dog_cat = @sql_dog_cat, postcode = @sql_postcode, suburb = @sql_suburb, pet_age = @sql_pet_age, pet_breed = @sql_pet_breed, pet_gender = @sql_pet_gender, contact_phone_number = @sql_contact_phone_number WHERE user_Id = @sql_user_id')
            try {
                const { myFile } = req.files;
                myFile.mv(path.join(assetsFolder, myFile.name));
            } catch(err) {
                return res.status(400).json({message: 'unable to save the file'});
            }
            return res.status(201).json({'success': 'Profile Updated'});
        } catch (err) {
           return res.status(500).json({'message': err.message});    
    } 
};





module.exports = {handleProfile}

const dotenv = require('dotenv');// this returns an object 
dotenv.config();//Loads .env file contents into process.env by default.

module.exports = {
    PORT:process.env.PORT,
    SALT_ROUNDS:process.env.SALT_ROUNDS
};
const {UserService} = require('../services');
const {StatusCodes} = require('http-status-codes');
const {ErrorResponse,SuccessResponse} =require('../utils/common');

/**
 * POST /api/v1/signup  
 * req-body {email:abc@gmail.com,password:xxxyx}
 * 
 */
async function createUser(req,res)
{
    try {
        const city = await UserService.createUser({
            email:req.body.email,
            password:req.body.password
        })
        SuccessResponse.message = 'Successfully Created A User';
        SuccessResponse.data = city;
        return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.message ='Something went wrong while creating User'
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    createUser
}
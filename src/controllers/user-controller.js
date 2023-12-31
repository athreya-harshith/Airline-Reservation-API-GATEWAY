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

async function signIn(req,res)
{
    try {
        const user = await UserService.signIn({
            email:req.body.email,
            password:req.body.password
        })
        SuccessResponse.message = 'Successfully Singed In';
        SuccessResponse.data = user;
        return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.message ='Something went wrong while Signing In'
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}
async function addRoleToUser(req,res)
{
    try {
        const user = await UserService.addRoleToUser({
            id:req.body.id,
            role:req.body.role
        })
        SuccessResponse.message = 'Successfully Assigned the Role';
        SuccessResponse.data = user;
        return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
    } catch (error) {
        console.log(error);
        ErrorResponse.message ='Something went wrong while Assigning the Role'
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}
async function getAllUsers(req,res)
{
    try {
        console.log(req.body);
        console.log(req.params.id);
        const user = await UserService.getAllUsers();
        SuccessResponse.message = 'Successfully Fetched all Users';
        SuccessResponse.data = user;
        return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message ='Something went wrong while Fetching all Users'
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}
async function getUser(req,res)
{
    try {
        console.log(req.body);
        console.log(req.params.id);
        const user = await UserService.getUser(req.params.id);
        SuccessResponse.message = 'Successfully Fetched all Users';
        SuccessResponse.data = user;
        return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message ='Something went wrong while Fetching all Users'
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse);
    }
}
module.exports = {
    createUser,
    signIn,
    addRoleToUser,
    getAllUsers,
    getUser
}
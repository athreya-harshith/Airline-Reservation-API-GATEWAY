const {StatusCodes} = require('http-status-codes');
const {ErrorResponse} = require('../utils/common');
const AppError = require('../utils/errors/app-error');
const {UserService} = require('../services');
function validateAuthRequest(req,res,next)
{
    ErrorResponse.message = 'Something went wrong while signIn or signUp';
    let explanation = [];
    if(!req.body.email && !req.body.password)
    {
        explanation.push('Improper format of the data in incoming Request (EMAIL and PASSWORD not found)');
        ErrorResponse.error = new AppError(explanation,StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.email )
    {
        explanation.push('Improper format of the data in incoming Request (EMAIL not found)');
        ErrorResponse.error = new AppError(explanation,StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    if(!req.body.password )
    {
        explanation.push('Improper format of the data in incoming Request (PASSWORD not found)');
        ErrorResponse.error = new AppError(explanation,StatusCodes.BAD_REQUEST);
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
    next();
}
async function checkAuth(req,res,next)
{
    try {
        const isAuthenticated = await UserService.isAuthenticated(req.headers['x-access-token']);//gets the id of the user
        if(isAuthenticated){
            req.user = isAuthenticated;//set the user id in request object 
            // this will be a siginifier for the internal API's that the incoming request is a authenticated request 
            // and this (req.user) is the user who authenticated himself 
            next();
        }
    } catch (error) {
        ErrorResponse.message = 'Something went wrong while processing';
        let explanation = [];
        // explanation.push('Improper format of the data in incoming Request (User Not Authorized)');
        // ErrorResponse.error = new AppError(explanation,StatusCodes.BAD_REQUEST);
        // to obtain the error from the underlying layer that throws just use ErrorResponse.error = error
        ErrorResponse.error = error;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}

async function isAdmin(req,res,next)
{
    try {
        const response = await UserService.isAdmin(req.user);
        if(!response)
        {
            return res.status(StatusCodes.UNAUTHORIZED).json({message:'User is not Authorized for this action'});
        }
        next();
    } catch (error) {
        ErrorResponse.message = 'Something went wrong while processing';
        ErrorResponse.error = error;
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }
}

module.exports = {
    validateAuthRequest,
    checkAuth,
    isAdmin
}
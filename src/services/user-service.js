const { StatusCodes } = require('http-status-codes');
const {UserRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const userRepository = new UserRepository();
const {Auth} = require('../utils/common')
async function createUser(data)
{
    try {
        const user  = await userRepository.create(data);
        return user;
    } catch (error) {
        // console.log(error);
        if(error.name == 'SequelizeValidationError' || error.name == 'SequelizeUniqueConstraintError')
        {
           let explanation = [];
           error.errors.forEach((err)=>
           {
               explanation.push(err.message);
           });
           console.log(explanation);
           throw new AppError(explanation,StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Cannot Create a new User Object',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signIn(data)
{
    try {
        const user = await userRepository.getUserByEmail(data.email);
        if(!user)
            throw new AppError('No user found for the given email',StatusCodes.NOT_FOUND);
        const passwordMatch = Auth.checkPassword(data.password,user.password);
        if(!passwordMatch)
            throw new AppError('Invalid Password',StatusCodes.BAD_REQUEST);
        const jwt = Auth.createToken({id:user.id,email:user.email});
        return jwt;
    } catch (error) {
        console.log(error);
        if(error instanceof AppError)
            throw error;
        throw new AppError('Something Went Wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createUser,
    signIn
}
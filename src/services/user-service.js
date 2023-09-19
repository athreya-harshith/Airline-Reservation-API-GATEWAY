const { StatusCodes } = require('http-status-codes');
const {UserRepository,RoleRepository} = require('../repositories');
const AppError = require('../utils/errors/app-error');
const userRepository = new UserRepository();
const {Enums} = require('../utils/common');
const {ADMIN,CUSTOMER,FLIGHT_COMPANY} = Enums.USER_ROLES;
const roleRepository = new RoleRepository();
const {Auth} = require('../utils/common')
async function createUser(data)
{
    try {
        const user  = await userRepository.create(data);
        const role = await roleRepository.getRoleByName(CUSTOMER);
        user.addRole(role);
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
async function isAuthenticated(token)
{
    try {
        if(!token)
            throw new AppError('Missing JWT token',StatusCodes.BAD_REQUEST);
        const response = Auth.verifyToken(token);// if not verified then it throws an error (JsoneWebTokenError) this will be caught in the below catch block
        const user = await userRepository.get(response.id);
        if(!user)
            throw new AppError('No User Found',StatusCodes.NOT_FOUND);
        return user.id;// return the Id of the user 
    } catch (error) {
        if(error instanceof AppError)
            throw error;
        if(error.name == 'JsonWebTokenError')
            throw new AppError('Invalid JWT token',StatusCodes.BAD_REQUEST);
        if(error.name == 'TokenExpiredError')
            throw new AppError('JWT token Expired',StatusCodes.BAD_REQUEST);
        console.log(error);
        throw new AppError('Something Went Wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }   
}
async function addRoleToUser(data)
{
    try {
        const user = await userRepository.get(data.id);
        if(!user)
            throw new AppError('No User found for the given Id',StatusCodes.NOT_FOUND);
        const role = await roleRepository.getRoleByName(data.role);
        if(!role)
            throw new AppError('No Role found for the given Name',StatusCodes.NOT_FOUND);
        user.addRole(role);
        return user;
    } catch (error) {
        if(error instanceof AppError)
            throw error;
        console.log(error);
        throw new AppError('Something Went Wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function isAdmin(id)
{
    try {
        const user = await userRepository.get(id);
        if(!user)
            throw new AppError('No User found for the given Id',StatusCodes.NOT_FOUND);
        const adminRole = await roleRepository.getRoleByName(ADMIN);
        if(!adminRole)
            throw new AppError('No Role found for the given Name',StatusCodes.NOT_FOUND);
        return user.hasRole(adminRole);
    } catch (error) {
        if(error instanceof AppError)
            throw error;
        console.log(error);
        throw new AppError('Something Went Wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
async function isAdminOrCompany(id)
{
    try {
        const user = await userRepository.get(id);
        if(!user)
            throw new AppError('No User found for the given Id',StatusCodes.NOT_FOUND);
        const adminRole = await roleRepository.getRoleByName(ADMIN);
        const companyRole = await roleRepository.getRoleByName(FLIGHT_COMPANY);
        if(!adminRole && ! companyRole )
            throw new AppError('No Role found for the given Name',StatusCodes.NOT_FOUND);
        const ar =await user.hasRole(adminRole);
        const fc =await user.hasRole(companyRole);
        console.log(ar);
        console.log(fc);
        console.log(ar | fc);
        return ar |fc;
    } catch (error) {
        if(error instanceof AppError)
            throw error;
        console.log(error);
        throw new AppError('Something Went Wrong',StatusCodes.INTERNAL_SERVER_ERROR);
    }
}
module.exports = {
    createUser,
    signIn,
    isAuthenticated,
    addRoleToUser,
    isAdmin,
    isAdminOrCompany
}
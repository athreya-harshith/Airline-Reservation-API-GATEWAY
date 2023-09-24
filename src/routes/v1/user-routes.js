const express = require('express');
const router= express.Router();
const {UserController} = require('../../controllers');
const {AuthMiddlewares} = require('../../middlewares');
router.get('/',UserController.getAllUsers);
router.get('/:id',UserController.getUser);
router.post('/signup',AuthMiddlewares.validateAuthRequest,UserController.createUser);
router.post('/signin',AuthMiddlewares.validateAuthRequest,UserController.signIn);
router.post('/role',AuthMiddlewares.checkAuth,AuthMiddlewares.isAdmin,UserController.addRoleToUser);
module.exports = router;


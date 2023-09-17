'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
const {ServerConfig} = require('../config');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Role,{through:'User_Roles', as : 'role'});
    }
  }
  User.init({
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate:{
        isEmail:true
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        len:[3,40]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(function encryptPassword(user)
  {
    // console.log('user object before encryption',user);
     const encryptedPassword = bcrypt.hashSync(user.password,+ServerConfig.SALT_ROUNDS);//here +ServerConfig.SALT_ROUNDS converts the string to number
     user.password = encryptedPassword;
    //  console.log('user object after encryption',user);
  })
  return User;
};
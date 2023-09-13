const express = require('express');
const router = express.Router();

const {InfoController} = require('../../controllers');
const userRoutes = require('./user-routes')
// route.get('/info',(req,res)=>{
//     res.send({msg:"OK"});
// }); this is not compact one as there is a better implementation of this controller 
//  by writing this in the controller module and importing it into here
 router.get('/info', InfoController.info);
 router.use('/signup',userRoutes);

module.exports = router;

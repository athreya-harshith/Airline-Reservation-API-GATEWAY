const express = require('express');
// in the below line object destructuring happens and the PORT is a constant that hold the value of the key : value pair PORT:process.env.PORT
const {ServerConfig,Logger} = require('./config');// no need for './config/index' it automatically pics index.js

const app = express();
const apiRoutes = require('./routes');
//proxy middleware
const { createProxyMiddleware } = require('http-proxy-middleware');
//auth middlewares
const {AuthMiddlewares} = require('./middlewares');
// rate limiter
const { rateLimit } = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 1000// only 3 requests for an IP address 
});
app.use(limiter);

app.use('/flightsService',AuthMiddlewares.isAdminOrCompany,createProxyMiddleware({ target: ServerConfig.FLIGHTS_SERVICE, 
        changeOrigin: true,
        pathRewrite:{'^/flightsService' : '/'} //this rewrites the path
    }));
app.use('/bookingService', createProxyMiddleware({ target: ServerConfig.BOOKING_SERVICE, 
        changeOrigin: true,
        pathRewrite:{'^/bookingService' : '/'} // rewrites the path to / in booking service
    }));
//always use this after creating the proxy middleware or else request body doesnot work
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//both above are for reading requests that has request body
app.use('/api',apiRoutes);
app.listen(ServerConfig.PORT,()=>{
    console.log(`Server is up and running on the port ${ServerConfig.PORT}`);
    // Logger.info({message:'some logging is begin done',error:"some error caught",label :'some label according to us'});
});

// to check the requests for the flightsService and add the middlewares according to them


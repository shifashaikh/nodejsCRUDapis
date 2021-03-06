const express = require("express")
const ProductRoutes = require('./api/routes/products');
const OrderRoutes = require("./api/routes/orders");
const UserRoutes = require("./api/routes/user");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const  mongoose = require("mongoose");

const app = express();

// app.use((req,res)=>{
// res.status(200).json({
//     message:"It works!"
// });
// });

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// adding headers
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Header",
        'Origin,X-Requested-With,Content-Type,Accept, Authorization'
    );
    if (req.method == 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
        res.status(200).json({})
    }
    next();
})
app.use("/products", ProductRoutes);
app.use("/orders", OrderRoutes);
app.use("/user", UserRoutes)

// mongoose connect

mongoose.connect("mongodb+srv://shifa123:"+ process.env.MONGO_ATLAS_PW +"@cluster0.vwded.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
{useNewUrlParser: true ,useUnifiedTopology: true},()=>{
    console.log("connection successfulll")
})

// mongoose.Promise = global.Promise;

//-- mongoose connect --
app.use((req, res, next) => {
    const error = new Error("not found !");
    error.status(404);
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })

})

module.exports = app;
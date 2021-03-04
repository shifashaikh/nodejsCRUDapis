const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { populate } = require("../models/order");
const Order = require("../models/order")
const Product = require("../models/product")

// ---------------handle incoming GET request ----------------------
router.get('/', (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    // populate 
    .populate('product','name')
    .exec()
    .then(allOrders => {
            console.log(allOrders)
            res.status(200).json({
                count : allOrders.length,
                orders :allOrders.map(allOrders=>{
                    return {
                     _id :allOrders._id,
                     product : allOrders.product,
                     quantity : allOrders.quantity,

                        request:{
                            type:'GET',
                            url:'http://localhost:3000/orders/' + allOrders._id
                        }
                    }  
                })
                
             })
        })
        .catch(err => {
            console.log(err)
        })
});
// ---------------handle incoming GET request ----------------------
//---------------- Post request  create a new Order--------------------------------

router.post('/', (req, res, next) => {
// check if the product exist
Product.findById(req.body.productId)
.then( product =>{
    const order = new Order({
        // create product
        _id: new mongoose.Types.ObjectId(),
        quantity :req.body.quantity,
        product :req.body.productId
        
    });

    return order.save()

    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Order Added Successfully",
            createdOrder: {
                _id : result._id,
                product : result.product,
                quantity : result.quantity
            },
            request:{
                type:'POST',
                url:'http://localhost:3000/orders/' + result._id
            }
        })
    })
    
})
.catch(err=>{
    res.status(500).json({
        message : "Product not found ",
        error : err
    })
})

});
//---------------- Post request  --------------------------------

// -------------------------get id ------------------------------
router.get('/:orderID', (req, res, next) => {
    const id = req.params.orderID;
    Order.findById(id)
    .populate('product','name')
    .exec()
        .then(orderbyID => {
            console.log(orderbyID)
        res.status(200).json({
            order: orderbyID,
            request:{
                type:"GET",
                url:'http://localhost:3000/orders/' + orderbyID._id
            }
        })
        })
        .catch(err => {
            console.log(err)
        })
});

// -------------------------get id ------------------------------
// -------------------------update------------------------------
router.patch('/:orderID', (req, res, next) => {
    const id = req.params.orderID;
    const updateOps={}
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Order.updateMany({_id : id }, {$set:updateOps })
    .exec()
    .then( result=>{
        console.log(result) 
        res.status(200).json(result)

    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({message : "Update Unsuccessful"})
    })
});
 
// [ {  "propName"  : "quantity" ,"value" : "900" }]

// -------------------------update------------------------------
// -----------------       delete     ------------------
router.delete('/:orderID', (req, res, next) => {
    const id = req.params.orderID;
    Order.remove({ _id: id }).exec()
        .then(deletedorders => {
            console.log(deletedorders)
            res.status(200).json({
                message : " Deleted successfully ",
                product : deletedorders ,
                request:{
                   message: "Deleted order successfully ",
                   type:'DELETE',
                   url:'http://localhost:3000/orders/' +  deletedorders.id,
                   data : { name : 'String' ,price : 'Number'}
                }
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: " Order Not Found " })
        })
});

// -----------------delete------------------
module.exports = router;
const express = require("express");
const Product = require('../models/product')
const mongoose = require("mongoose");
const { json } = require("body-parser");
const router = express.Router();
// const checkAuth =require("../middleware/check-auth");
const multer = require("multer");
const upload = multer({dest:'uploads/'})

// ---------------------- get request  view all products---------------------
router.get('/',upload.single('productImage') ,(req, res, next) => {
    console.log(req.file)
    Product.find()
    .select('_id price name')
    .exec()
    .then(docs=>{
        // console.log(docs)

        const response ={
            count : docs.length,
            products:docs.map(doc=>{
                return{
                    name : doc.name,
                    price : doc.price,
                    _id : doc._id,
                 request :{
                     type : 'GET',
                     url:'http://localhost:3000/products/' + doc._id
                 }
                }
            })
        }
        res.status(200).json({ response })

    })
    .catch(err=>{
        console.log(err)
    })
});
// ---------------------- get request  view all products ---------------------

// ---------------Post request  add products --------------------------
router.post('/', (req, res, next) => {
    // create product
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created product successfully ",
            createdProduct: {
                name :result.name,
                price : result.price,
                id : result._id,
                request:{
                    type:'POST',
                    url:'http://localhost:3000/products/' + result._id
                }
            }
        })
    })
        .catch(error => {
            console.log(error)
        })

  
});


//   --------------- Post request  add products ---------------

// ----------------- get id     search item by using ids------------------------
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec().then(productbyID=>{
        console.log(productbyID)
        if(productbyID){
            res.status(200).json({
                message: "Searched product by id successfully ",
                product : productbyID,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/' + productbyID._id

                }
            })
        }else{
            res.status(404).json({message : " No valid entry "})
        }
    })
});
// ----------------- get id  search item by using ids------------------------


// -----------------update  product-------------------------
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps={}
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateMany({_id : id }, {$set:updateOps })
    .exec()
    .then( result =>{
        console.log(result) 
        res.status(200).json({
             message: "Product Updated" ,
             request:{
                message: "Updated product successfully ",
                type:'PATCH',
                url:'http://localhost:3000/products/' +  id


                // undefined 
             }

        }
        )

    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({message : " Update Unsuccessful"})
    })
});

// -----------------update product-------------------------
//--------------- delete  product------------------------------
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id :id}).exec()
    .then(deletedproduct=>{
        console.log(deletedproduct)
            res.status(200).json(
                {
                    message : " Deleted successfully ",
                    product : deletedproduct ,
                    request:{
                       message: "Deleted product successfully ",
                       type:'DELETE',
                       url:'http://localhost:3000/products/' +  id,
                       data : { name : 'String' ,price : 'Number'}
                    }
                })
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({message : " No Enteries Found "})
    })
});
//--------------- delete  product------------------------------

module.exports = router;
const express = require("express");
const User = require('../models/user')
const mongoose = require("mongoose");
const router = express.Router();
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


// user login
router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(users => {
      if (users.length < 1) {
        return res.status(401).json({
          message: "Auth Failed"
        });
      }

      bcrypt.compare(req.body.password, users[0].password, (err, result) => {

        if (err) {
          return res.status(401).json({
            message: "Auth failed "
          });

        }

        if (result) {
          const token = jwt.sign({
            email: users[0].email,
            id: users[0]._id
          },
            process.env.JWT_KEY,
            {
              expiresIn: "1hr"
            },
)
            return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
      })

    })
    .catch(err => {
      console.log(err)
    })
})


router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});


// delete user 
router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


module.exports = router;


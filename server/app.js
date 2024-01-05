require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const salt_round = 10;
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
//Connect Database to Server
require('./DB_connect.js');

//User Model Schema
const Schema = {
    username: String,
    phone: String,
    name: String,
    email: String,
    password: String,
}
const UserModel = new mongoose.Schema(Schema, { timestamps: true });
const Model = mongoose.model(process.env.DATABASE, UserModel, process.env.DATABASE);
//APIs
app.get('/',async(req,res)=>{
    const response=await Model.find({});
    res.send(response);
})
app.post('/users', async (req, res) => {
    const response = await Model.find({ email: req.body.email }, "-_id -updatedAt -__v");
    response.forEach((e) => {
        bcrypt.compare(req.body.password, e.password, function (err, result) {
            if (err)
                console.log("ERROR in comparing: ", err);
            if (result == true) {
                res.send(e);
                return 1;
            }
        });
    });
    res.send(false);
});
app.delete('/delete', async (req, res) => {
    const response = await Model.deleteMany({});
    res.send(response);
});
app.post('/post', async (req, res) => {
    //Pain Password to hash password
    bcrypt.hash(req.body.password, salt_round).then(async hash => {
        // console.log(`hash of ${req.body.password} is ${hash}`);
        req.body.password = hash;
        const user = new Model(req.body);
        const response = await user.save();
        res.send(response);
    }).catch((e) => {
        console.log("Error in hashing : ", e);
    });
})
//Get port Number from enviroment variable
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

//Hash : hash is store to DB and which is become hash after some operation on painPassword by bcrypt
//Salt : salt is solved version of hash that not store anywhere
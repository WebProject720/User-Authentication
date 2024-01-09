require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const JWT = require('./jwt.js');
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
    username: {
        type: String,
        required: true
    },
    phone: String,
    name: String,
    email: String,
    password: String,
}
const UserModel = new mongoose.Schema(Schema, { timestamps: true });
const Model = mongoose.model(process.env.DATABASE, UserModel, process.env.DATABASE);
//APIs
app.get('/', async (req, res) => {
    const response = await Model.find({});
    res.send(response);
});
app.post('/data', (req, res) => {
    let token = JWT.checkToken(req.body.token.split(" ")[1])
    res.send({ username: token.obj.username, status: true });
})
app.delete('/delete', async (req, res) => {
    const response = await Model.deleteMany({});
    res.send(response);
});
app.post('/login', async (req, res) => {
    const response = await Model.find({ email: req.body.email }, "-_id -updatedAt -__v");
    if (response.length > 0) {
        try {
            let token = JWT.getToken({ "username": response[0].username });
            bcrypt.compare(req.body.password, response[0].password, function (err, result) {
                if (err)
                    console.log("ERROR in comparing: ", err);
                if (result) {
                    res.send({ "token": token, "status": true });
                } else {
                    res.send({ status: false });
                }
            });
        } catch (err) {
            console.log("Error Login API");
            res.status(500).send({ status: false, error: "Internal Server error in Login API" });
        }
    } else {
        res.status(404).send({ status: false, error: "User not Found" });
    }
});
app.post('/signup', async (req, res) => {
    //Pain Password to hash password
    bcrypt.hash(req.body.password, salt_round).then(async hash => {
        req.body.password = hash;
        const user = new Model(req.body);
        await user.save();
        res.send({
            status: true
        });
    }).catch((e) => {
        console.log("Error in hashing : ", e);
        req.send({ status: false, ERROR: new Error("Something Went wrong in Sign Up API") });
    });
})
//Get port Number from enviroment variable
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at port ${port}`);
});

//Hash : hash is store to DB and which is become hash after some operation on painPassword by bcrypt
//Salt : salt is solved version of hash that not store anywhere
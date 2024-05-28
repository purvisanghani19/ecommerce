const express = require('express');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});




module.exports =  mongoose.model("user", userSchema)

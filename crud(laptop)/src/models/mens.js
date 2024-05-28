const express = require('express');
const mongoose = require('mongoose');

const menSchema = new mongoose.Schema({
    ModallName: {
        type: String,
        require: true
    },
    processor: {
        type: String,
        require: true
    },
    color: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    company: {
        type: String,
        require: true
    },
    // userId: {
    //     type: String,
    //     require: true
    // },
    Img: {
        type: String,
    }

})

//creating a new collection
const laptop = new mongoose.model("laptop", menSchema)

module.exports = laptop;
const express = require("express");
const laptop = require('../src/models/mens');
const userproduct = new express.Router();

//handle get api--------------------------------------------

userproduct.get("/get-user-product", async (req, res) => {
    try {
        const getlaptops = await laptop.find({});
        if (getlaptops.length > 0) {
            res.send(getlaptops);
        } else {
            res.send("No result Found !");
        }
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports = userproduct;
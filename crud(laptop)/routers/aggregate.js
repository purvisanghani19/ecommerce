const express = require("express");
const aggregate = new express.Router();
const laptop = require('../src/models/mens');




//handle aggregate-get api--------------------------------------------

aggregate.post("/aggregate-get-allaptop", async (req, res) => {
    try {

        const { company, processor } = req.body;

        // console.log('company---', company)

        let matchStage = {};
        if (company && processor   ) {
            matchStage = { company: { $in: company }, processor: { $in: processor } };
        } else if (company) {
            matchStage = { company: { $in: company } };
        } else if (processor) {
            matchStage = { processor: { $in: processor } };
        } else {
            return res.send("Please provide either a company or a processor");
        }

        const aggResult = await laptop.aggregate([
            { $match: matchStage },
            // { $group: { _id: "$company", processors: { $push: "$processor" } } }
        ]);


        if (aggResult.length > 0) {
            res.json({ aggResult });
        } else {
            res.send("No result Found !");
        }
    } catch (e) {
        res.status(400).send(e);
    }
})





module.exports = aggregate;
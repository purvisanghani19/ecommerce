const express = require("express");
const router = new express.Router();
const laptop = require('../src/models/mens');
const user = require("../src/models/user");
const multer = require('multer');
const path = require('path');
const fs = require('fs')
const Jwt = require('jsonwebtoken');
const jwtkey = 'e-com';
const verifyToken = require("../middaleware/auth");



//file upload -------------------------------------------------------------------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const fileType = /jpeg|png|jpg|gif/
        const mimeType = fileType.test(file.mimetype.toLowerCase())
        const extname = fileType.test(path.extname(file.originalname).toLowerCase())

        if (mimeType && extname) {
            return cb(null, true)
        }
        cb("Please upload only JPEG, PNG, JPG or GIF images")
    }
}).single('Img');


// router.post("/upload", upload, (req, res) => {
//     res.send("file upload ")
// });



//handle post req-------------------------------------------
router.post("/add-product", upload, verifyToken, async (req, res) => {


    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    let info = {
        Img: req.file.filename,
        ModallName: req.body.ModallName,
        processor: req.body.processor,
        color: req.body.color,
        price: req.body.price,
        company: req.body.company,
    }

    try {
        const addinglaptop = new laptop(info)
        // console.log("info::::::::;", req.file);
        const insertlaptop = await addinglaptop.save();
        res.status(201).send(insertlaptop);
    } catch (e) {
        res.status(400).send(e);
    }
})


//handle get api--------------------------------------------

router.get("/get", verifyToken, async (req, res) => {
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

//handle get-one api--------------------------------------------

router.get("/getone/:id", verifyToken, async (req, res) => {
    try {
        const _id = req.params.id;
        const getlaptop = await laptop.find({ _id: _id });
        res.send(getlaptop);
        console.log("getlaptop", getlaptop)
    } catch (e) {
        res.status(400).send(e);
    }
})

//handle patch(update) req api--------------------------------------------

router.put("/update/:id", verifyToken, upload, async (req, res) => {

    let info = {
        Img: req.file.filename,
        ModallName: req.body.ModallName,
        processor: req.body.processor,
        color: req.body.color,
        price: req.body.price,
        company: req.body.company,
    }


    try {
        const _id = req.params.id;
        const getlaptop = await laptop.findByIdAndUpdate(_id, info, {
            new: true
        });

        res.send(getlaptop);
    } catch (e) {
        res.status(500).send(e);
    }
})

//handle delete req api--------------------------------------------

router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        // const _id = req.params.id;
        const getlaptop = await laptop.findByIdAndDelete(req.params.id);
        res.send(getlaptop);
    } catch (e) {
        res.status(400).send(e);
    }
})


// search api--------------------------------------------

router.get("/search/:key", verifyToken, async (req, res) => {
    try {
        // const _id = req.params.id;
        const getlaptop = await laptop.find({
            "$or": [
                { ModallName: { $regex: req.params.key } },
                { processor: { $regex: req.params.key } },
                { color: { $regex: req.params.key } }
            ]
        });
        res.send(getlaptop);
    } catch (e) {
        res.status(400).send(e);
    }
})




//register post api------------------------------------------------------------


router.post("/register", async (req, res) => {
    try {
        const userlogin = new user(req.body)
        console.log(req.body);
        const insertuser = await userlogin.save();
        Jwt.sign({ userlogin }, jwtkey, { expiresIn: "2h" }, (err, token) => {
            if (err) {
                res.send({ insertuser: "wrong try again later" })
            }
            res.send({ insertuser, auth: token })
        })
    } catch (e) {
        res.status(400).send(e);
    }
})



//Login post api------------------------------------------------------------


router.post("/login", async (req, resp) => {
    console.log(req.body)
    if (req.body.password && req.body.email) {
        let userlogin = await user.findOne(req.body).select("-password");
        if (userlogin) {
            Jwt.sign({ userlogin }, jwtkey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send({ result: "wrong try again later" })
                }
                resp.send({ userlogin, token: token })
            })

        } else {
            resp.send({ result: "No user found !" })
        }
    } else {
        resp.send({ result: "No user found !" })
    }


})





module.exports = router; 
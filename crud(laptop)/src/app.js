const express = require('express');
const router = require("../routers/route")
const aggregate = require("../routers/aggregate")
const userproduct = require("../routers/userproduct")
const cors = require("cors");
require("../db/conn");
const app = express();
const port = process.env.PORT || 5000;



app.use(express.json());
app.use(cors());



app.use(router);
app.use(userproduct);
app.use(aggregate);


//static folder image 
app.use('/uploads', express.static('uploads'))
// app.use('/images', express.static('uploads'))



app.listen(port, () => {
    console.log(`connection is live at port no. ${port}`);
})
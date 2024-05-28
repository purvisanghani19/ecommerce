const Jwt = require('jsonwebtoken');
const jwtkey = 'e-com';

//verify token------------------------------------------------------------------------------------

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (token) {
        abc = token.split(' ')[1];
        Jwt.verify(abc, jwtkey, (err, valid) => {
            if (err) {
                res.status(401).send({ Result: "please provide valid token" })
            } else {
                next();
            }
        })
    } else {
        res.status(403).send({ Result: "plese send token with header" })
    }


}

module.exports = verifyToken;
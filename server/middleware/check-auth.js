const jwt = require("jsonwebtoken");

// req res next as it will be a middleware function
module.exports = function(req, res, next) {
    const authHeader = req.headers["authorization"];

    let token;
    if(authHeader) {
        token = authHeader.split(" ")[1];
    } else {
        token = null;
    }
    console.log(token);
    if (token == null) {
        return res.sendStatus(401);
    }
    console.log("Token found");

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err){ 
            console.log(err);
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    });
};
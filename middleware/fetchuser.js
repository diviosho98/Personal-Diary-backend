// this middleware is made because wherever the details of the logged user needed this middleware is called
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'personaldiary';

const fetchuser = (req, res, next)=>{
    //get the user from the provided jwt token and add id to req object
    const token = req.header('authtoken');
    if (!token) {
        res.status(401).send({ error: "please authenticate using valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user
        next();
    }
    catch (err) {
        res.status(401).send({ error: "please authenticate using valid token" });
    }
}

module.exports =fetchuser;
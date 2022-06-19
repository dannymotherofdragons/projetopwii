const jwt = require("jsonwebtoken");
const config = require("../utilities/config.js");

exports.verifyToken = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token.replace('Bearer ', ''), config.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.loggedUserId = decoded.id;
        req.loggedUserRole = decoded.userType
        console.log(decoded.id);
        console.log(decoded.userType);

    })

}

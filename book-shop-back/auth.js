const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const authorizationUser = function(req, res){
    try {
        let receivedJwt = req.headers["authorization"];
        console.log("jwt:", receivedJwt);

        if (receivedJwt) {
            let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
            console.log("decoded:", decodedJwt);
            return decodedJwt;
        } else {
            throw new ReferenceError("jwt must be provided");
        }
    } catch (err) {
        console.log(err.name);
        console.log(err.message);

        return err;
    }
};

module.exports = authorizationUser;
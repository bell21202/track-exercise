const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User'); 

module.exports = (req, res, next) => {
    // express automatically downcases any headers coming in
    // pull off the authorization header
    const {authorization} = req.headers;

    if (!authorization) {
        return res.status(401).send({error: 'You must be logged in.'});
    }

    // replace the bearer and space with an empty string
    const token = authorization.replace('Bearer ','');
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        if (err) {
            // let's keep this vague..
            return res.status(401).send({error: 'You must be logged in.'});
        }

        // destructure off the userid 
        const {userId} = payload;
        const user = await User.findById(userId);
        req.user = user;
        next();
    });
}
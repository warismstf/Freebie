const User = require("../models/user");
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email })
        .exec((error, user) =>
        {
            if (user) return res.status(400).json({
                message: 'User already registered'
            });
        });

    const {
        firstName,
        lastName,
        email,
        password,
        userName
    } = req.body;

    const _user = new User({
        firstName,
        lastName,
        email,
        password,
        userName
    });

    _user.save((error, data) =>
    {
        if (error) {
            console.log(error); // log the error to the console
            if (error.name === 'ValidationError') {
                // return specific error message for validation errors
                return res.status(400).json({
                    message: 'Validation error: ' + error.message
                });
            } else {
                // return generic error message for other errors
                return res.status(400).json({
                    message: 'Error saving user: ' + error.message
                });
            }
        }

        if (data)
        {
            return res.status(201).json({
                message: 'User created successfully'
            });
        }
    });
}

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email })
        .exec((error, user) =>
        {
            if (error) return res.status(400).json({ error });
            if (user) {
                if(user.authenticate(req.body.password)) {
                    const token = jwt.sign({ _id: user._id }, 'MERNSECRET', { expiresIn: '1h' });
                    const { _id, firstName, lastName, email, role, fullName } = user;
                    res.status(200).json({
                        token,
                        user: {
                            _id, firstName, lastName, email, role, fullName
                        }
                    });
                } else {
                    return res.status(400).json({
                        message: 'Invalid password'
                    });
                }
            }else{
                return res.status(400).json({ message: 'Something went wrong' });
            }
        });
}

exports.requiresSignin = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    req.user = jwt.verify(token, 'MERNSECRET');
    next();
   // jwt.decode()
}
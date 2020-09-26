const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    promises: fsPromises
} = require('fs');
const path = require('path');
const createAvatar = require('../helpers/createAvatar')
createAvatar()
const getUserByEmail = async email => {
    return await userModel.findOne({
        email,
    });
};
const updateUserToken = async (id, newToken) => {
    return await userModel.findByIdAndUpdate(id, {
        token: newToken,
    });
};

exports.authorize = async (req, res, next) => {
    try {
        const authorizationHeader = req.get('Authorization');
        const token = authorizationHeader.replace('Bearer ', '');

        let userId;
        try {
            userId = await jwt.verify(token, process.env.JWT_SECRET).uid;
        } catch (err) {
            next(err);
        }

        const user = await userModel.findById(userId);

        if (!user || token !== user.token) {
            res.status(401).json('Not authorized');
        }

        req.user = user;
        req.token = token;

        next();
    } catch (err) {
        next(err);
    }
};

exports.registerUser = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json('Email in use');
        }
        const hashPassword = await bcrypt.hash(
            password,
            Number(process.env.BCRYPT_SALT),
        );
        const user = await userModel.create({
            ...req.body,
            password: hashPassword,
        });

        res.status(201).json({
            email: user.email,
            subscription: user.subscription,
            id: user._id,
        });
    } catch (error) {
        next(error);
    }
};

exports.loginUser = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(401).json('Email or password is wrong');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        return res.status(401).json('Email or password is wrong');
    }
    const token = await jwt.sign({
            uid: user._id,
        },
        process.env.JWT_SECRET,
    );
    await updateUserToken(user._id, token);

    res.status(200).json({
        token,
        id: user._id,
        email: user.email,
        subscription: user.subscription,
    });
};
exports.currentUser = async (req, res, next) => {
    try {
        const {
            token,
            user
        } = req;
        res.status(200).json({
            id: user._id,
            email: user.email,
            subscription: user.subscription,
        });
    } catch (error) {
        next(error);
    }
};
exports.logoutUser = async (req, res, next) => {
    try {
        const {
            user,
            token
        } = req;
        await updateUserToken(user._id, null);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
exports.updateSubscription = async (req, res, next) => {
    try {
        const {
            user
        } = req;

        const result = await userModel.findByIdAndUpdate(
            user._id, {
                subscription: req.body.subscription,
            }, {
                new: true,
            },
        );
        console.log(result);

        res.status(200).json({
            id: result._id,
            email: result.email,
            subscription: result.subscription,
        });
    } catch (error) {
        next(error);
    }
};
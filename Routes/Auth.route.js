const express = require('express');
const createHttpError = require('http-errors');
const router = express.Router();
const client = require('./../helpers/init_redis')
const User = require('../Models/User,model')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper')

router.get('/', async (req, res, next) => {
    res.send("Authticate Main Router")
});

router.post('/register', async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body)
        const emaildoesNotxist = await User.findOne({ email: result.email });
        if (emaildoesNotxist) {
            throw createHttpError.Conflict(`${result.email} already Rdgister`)
        }
        const user = new User(result);
        const saveUser = await user.save()
        const accessToken = await signAccessToken(saveUser.id)
        const refreshToken = await signRefreshToken(saveUser.id)
        res.send({ accessToken, refreshToken })
    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
});

router.post('/login', async (req, res, next) => {
    try {

        const result = await authSchema.validateAsync(req.body);
        const user = await User.findOne({ email: result.email });
        if (!user) throw createHttpError.NotFound(`${result.email} Is NOT Register`);

        const isMatch = await user.isValidPassword(result.password);
        if (!isMatch) throw createHttpError.Unauthorized(`PAssword Is NOT Match`);

        const accessToken = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)

        res.send({ "accessToken": accessToken, "refreshToken": refreshToken })
        // res.send(result)
        // 
    } catch (error) {
        if (error.isJoi === true)
            return next(createHttpError.BadRequest("Invalid Email / Password"))
        next(error)
    }
});

router.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createHttpError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken)

        const accesstoken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)
        res.send({ "accesstoken": accesstoken, "refreshToken": refToken })
    } catch (error) {
        next(error)
    }
    // res.send("refresh-token Routrs")
});

router.delete('/logout', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createHttpError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken)
        client.DEL(userId, (err, val) => {
            if (err) {
                console.log(err.message);
                throw createHttpError.InternalServerError()
            }
            console.log(val);
            res.sendStatus(204)
        })
    } catch (error) {
        next(error)
    }
});



module.exports = router;
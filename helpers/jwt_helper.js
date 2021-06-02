const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const client = require('./init_redis');
// 
module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.ACCESS_TOKEN_SECRET
            const options = {
                expiresIn: "30s",
                issuer: "goels.herokuapp.com",
                audience: userId,
            }
            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    reject(createError.InternalServerError())

                }
                resolve(token)
            })
        })
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized());
        const authHandler = req.headers['authorization']
        const bearerToken = authHandler.split(' ');
        const token = bearerToken[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                // if (err.name === 'JsonWebTokenError') {
                //     return next(createError.Unauthorized())
                // } else {
                //     return next(createError.Unauthorized(err.message))
                // }
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
                // return next(createError.Unauthorized())
            }
            req.payload = payload
            next()
        })
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = process.env.REFRESH_TOKEN_SECRET
            const options = {
                expiresIn: "1y",
                issuer: "goels.herokuapp.com",
                audience: userId,
            }
            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message);
                    reject(createError.InternalServerError())
                }
                client.SET(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
                    if (err) {
                        console.log(err.message);
                        reject(createError.InternalServerError())
                        return
                    }
                    resolve(token)
                })
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) return reject(createError.Unauthorized())
                const userId = payload.aud
                client.GET(userId,  (err, reply) => {
                    if (err) {
                        console.log(err.message);
                        reject(createError.InternalServerError())
                        return
                    }
                    if (refreshToken === reply) return resolve(userId)
                    reject(createError.Unauthorized())
                })
                // resolve(userId)
            })
        })
    }
}
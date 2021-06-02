const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema
const UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function (next) {
    try {
        // res.send({ accesstoken })
        const salt = await bcrypt.genSalt(10) 
        const hashPassword = await bcrypt.hash(this.password, salt)
        this.password = hashPassword 
        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}


// UserSchema.pre('save', async function (next) {
//     try {
//         // enter yor code to befose save 
//         console.log("This Fun calling Before save ");
//     } catch (error) {
//         next(error)
//     }
// })

// UserSchema.post('save', async function (next) {
//     try {
//         console.log("This Fun calling After save ");
//     } catch (error) {
//         next(error)
//     }
// })

const User = mongoose.model('user', UserSchema)
module.exports = User
const bcrypt = require('crypto')
const key1 = bcrypt.randomBytes(32).toString('hex')
const key2 = bcrypt.randomBytes(32).toString('hex')
console.table({ key1, key2 })
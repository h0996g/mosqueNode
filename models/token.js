const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const tokenSchema = new mongoose.Schema({
    user_id: { type: ObjectId, ref: 'User', required: false },
    admin_id: { type: ObjectId, ref: 'Admin', required: false },
    token: { type: Number, required: true, },
    createdAt: { type: Date, default: Date.now, expires: 3600, },
});

const Token = mongoose.model('Token', tokenSchema)
module.exports = Token
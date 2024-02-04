const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { connections } = require('mongoose');
const opts = {toJSON: { virtuals: true } };


const StudentSchema = new Schema({
    name: String,
    email: String,
    location: String,
    description: String
}, opts);


module.exports = mongoose.model('student', StudentSchema);

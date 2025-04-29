const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    resume: {
        type: String,
    },
    skills: {
        type: [String],
        default: [],
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
// This code defines a Mongoose schema for a User model in a Node.js application. The schema includes fields for name, email, password, resume, and skills. The email field is unique, and the skills field defaults to an empty array. The model is then exported for use in other parts of the application.
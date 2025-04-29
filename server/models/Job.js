const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    skills: {
        type: [String], // Example: ["React", "Node.js", "MongoDB"]
        default: [],
    },
    postedAt: {
        type: Date,
        default: Date.now,
    }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
// This code defines a Mongoose schema for a Job model in a Node.js application. The schema includes fields for job title, company, description, location, required skills (as an array), and the date the job was posted. The model is then exported for use in other parts of the application.
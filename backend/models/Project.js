const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        required: true,
        enum: ['Ideation', 'Development', 'Testing', 'Completed'],
        default: 'Ideation'
    },
    supportRequired: {
        type: String,
        default: 'None'
    },
    // ADD THIS NEW COMMENTS ARRAY
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            text: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    milestones: [
        {
            text: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
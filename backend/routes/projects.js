const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// @route   POST /api/projects
// @desc    Create a new project entry
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, stage, supportRequired } = req.body;

        const newProject = new Project({
            title,
            description,
            stage,
            supportRequired,
            user: req.user.id 
        });

        const project = await newProject.save();
        res.status(201).json(project);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/projects
// @desc    Get all projects (Live Feed)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Fetch all projects, sort by newest first, and attach the creator's name
        const projects = await Project.find().sort({ createdAt: -1 }).populate('user', ['name']);
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/projects/comment/:id
// @desc    Comment or raise hand for collaboration
// @access  Private
router.post('/comment/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const newComment = {
            user: req.user.id,
            text: req.body.text
        };

        project.comments.unshift(newComment);

        await project.save();
        res.json(project.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/projects/:id
// @desc    Update project progress (stage & milestones)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        // 1. Find the project
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // 2. Security Check: Make sure the person making the request is the project owner
        if (project.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this project' });
        }

        // 3. Extract the updates from the request
        const { stage, milestone } = req.body;

        // 4. Update the stage if a new one was provided
        if (stage) {
            project.stage = stage;
        }

        // 5. Add a new milestone if one was provided
        if (milestone) {
            project.milestones.push({ text: milestone });
        }

        // 6. Save and return the updated project
        await project.save();
        res.json(project);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/projects/celebration/wall
// @desc    Get all completed projects for the Celebration Wall
// @access  Private
router.get('/celebration/wall', auth, async (req, res) => {
    try {
        // Fetch only projects where the stage is 'Completed'
        const completedProjects = await Project.find({ stage: 'Completed' })
            .sort({ updatedAt: -1 }) // Sort by the most recently updated
            .populate('user', ['name']);
            
        res.json(completedProjects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
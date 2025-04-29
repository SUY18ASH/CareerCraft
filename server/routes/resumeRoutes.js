const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const router = express.Router();

// Setup multer (temporary storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Resume and Extract Text
router.post('/upload', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const data = await pdfParse(req.file.buffer);

        res.status(200).json({
            message: 'Resume uploaded and parsed successfully',
            extractedText: data.text
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error parsing resume' });
    }
});

// Simple Skill/Education/Experience Extraction API
router.post('/analyze', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'No text provided' });
    }

    // Define simple skills list
    const skillsList = ['JavaScript', 'Python', 'Java', 'Node.js', 'React', 'MongoDB', 'SQL', 'Machine Learning', 'NLP', 'AWS', 'Docker'];

    // Find matching skills
    const skills = skillsList.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));

    // Extract Education
    const educationRegex = /(Bachelor|Master|B\.Tech|M\.Tech|BSc|MSc|PhD)[^.\n]*/gi;
    const education = text.match(educationRegex) || [];

    // Extract Experience
    const experienceRegex = /(experience|worked at|internship|position|role)[^.\n]*/gi;
    const experience = text.match(experienceRegex) || [];

    res.status(200).json({
        message: 'Resume analyzed successfully',
        analysis: {
            skills,
            education,
            experience
        }
    });
});

module.exports = router;
// // This code defines an Express router for handling resume uploads. It uses multer for file handling and pdf-parse for extracting text from PDF resumes. The router has a POST endpoint '/upload' that accepts a file upload, parses the PDF to extract text, and returns the extracted text in the response. If there's an error during the process, it sends a 500 status with an error message.
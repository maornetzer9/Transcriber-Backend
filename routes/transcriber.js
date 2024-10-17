const express = require('express');
const handleFileUpload = require('../middleware/multerUpload');
const { transcribeController, summarizeController } = require('../controllers/transcriber');

const router = express.Router();

router.post('/', handleFileUpload, transcribeController);
router.post('/summarize', summarizeController);


module.exports = { transcriberRouter: router };
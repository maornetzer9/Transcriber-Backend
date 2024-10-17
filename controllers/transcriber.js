const { transcribe, summarize } = require("../services/transcriber");

const transcribeController = async (req, res) => {
    try
    {
        const response = await transcribe(req);
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error(err.message);
        return res.status(500).json('Internal server error');
    }
} 
const summarizeController = async (req, res) => {
    try
    {
        const response = await summarize(req);
        return res.status(200).json(response);
    }
    catch(err)
    {
        console.error(err.message);
        return res.status(500).json('Internal server error');
    }
} 


module.exports = { transcribeController, summarizeController };
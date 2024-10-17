const fs = require('fs');
const { Groq } = require('groq-sdk');  

const transcribe = async (req) => {
    try 
    {
        const file = req.file;
        const { apiKey, language, model, outputFormat } = req.body;
        
        // Initialize the Groq client with the API key
        const client = new Groq({ apiKey });

        // Build request options based on user input
        const options = {
            model,  // Model to use
            language: language !== 'auto' ? language : 'he',
            response_format: outputFormat === 'srt' ? 'srt' : 'json'  // Handle format
        };

        // Send the file to Groq's API for transcription
        const response = await client.audio.transcriptions.create({
            file:fs.createReadStream(file.path),  // Create a readable stream for the file
            prompt: 'אני צריך שתכתוב לי את הקובץ וידאו בעברית נושא השיחה הוא מכירה של מוצר כל שהוא ואני צריך שתוודא שאין שום שגיאות כתיב',
            ...options,  // Spread other options
        });

        // Extract the transcribed text from the response
        const data = outputFormat === 'srt' ? response : response.text;

        return { code: 200, transcribe: data };
    } 
    catch(err) 
    {
        console.error('Error transcribing file:', err.message);
        return { code: 500, message: 'Internal server error' };
    }
};


const summarize= async (req) => {
    const { transcription, apiKey } = req.body
    // Initialize the Groq client with the API key
    const client = new Groq({ apiKey });

    // Define the chat completion request payload
    const requestPayload = {
        model: 'llama3-groq-8b-8192-tool-use-preview',
        messages: [
            { role: 'user', content: `I'd like you to summarize this conversation in Hebrew: ${transcription}` }
        ],
        max_tokens: 1000
    };

    try 
    {
        // Use the Groq client to make the request
        const response = await client.chat.completions.create(requestPayload);

        // Return the summarized content from the response
        return { code: 200, summary: response.choices[0].message.content.trim() };
    } 
    catch(err) 
    {
        console.error(err.message);
        return { code: 500, message: 'Internal server error' };
    }
};

module.exports = { transcribe, summarize };
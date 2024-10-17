require('dotenv').config()
const express = require('express')
const cors = require('cors');

const { transcriberRouter } = require('./routes/transcriber');

const app = express();
const PORT =3000;
const ORIGIN = process.env.ORIGIN;
const corsOptions = { origin: ORIGIN };


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors(corsOptions));

app.use('/transcriber', transcriberRouter);


app.listen(PORT, () => console.info(`Server is running on PORT: ${PORT}`))
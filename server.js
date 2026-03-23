const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const openAI = reuire('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
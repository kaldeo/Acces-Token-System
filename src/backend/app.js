const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const app = express()

// IMPORTE FILES
const tokenFunctions = require('./token.js');

app.use(express.json());

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
    tokenFunctions.Connection(); // Appel de la fonction au démarrage
})


const express = require('express')
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const app = express()
// IMPORTE FILES
const tokenRouter = require('./token.js');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes d'authentification
app.use('/api', tokenRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
})



const port = process.env.PORT;
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})





const express = require('express');
const path = require('path');
const app = express();
const fabric = require('fabric').fabric;   
const fs = require('fs');

const Canvas = require('canvas');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());


app.get('/coords',(req, res) => {
    fs.readFile('src/data/coords.json','utf-8',(err,data) => {
    if (err){
        console.log("Errro",err);
        res.status(500).send('Error reading at json file');
    }
    const points = JSON.parse(data);
    res.json(points);
});
});



app.post('/updatePoints', (req, res) => {
    const updatedPoints = req.body;
    const jsonPoints = JSON.stringify(updatedPoints);
    fs.writeFile('src/data/coords.json', jsonPoints, 'utf-8', (err) => {
        if (err) {
            console.log("Error", err);
            res.status(500).send('Error writing JSON file');
        }
        console.log('Points updated successfully.');
        res.status(200).send('Points updated successfully.');
    });
});



const indexRouter = require('./routes/index');
const { log } = require('console');
const { json } = require('body-parser');
app.use('/', indexRouter);




// Start the server

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



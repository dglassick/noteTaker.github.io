// Dependet variables and nodes
const express = require("express");
const fs = require('fs');
const util = require('util');
fs.readFile = util.promisify(fs.readFile);
fs.writeFile = util.promisify(fs.writeFile);
// const Guest = require('./index')
var path = require("path");

//Set up the port and express
var app = express();
const PORT= process.env.PORT || 3500;

//allows express to parse the data
app.use(express.urlencoded( { extended: true}));
app.use(express.json());
app.use(express.static("Develop/public"));



//Routes to the index.html and notes.html

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});

app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
});

// NOTES OBJECT IS ON INDEX.JS 

//post request below wiill save the user's notes
app.post('/api/notes', async function(req, res){
    console.log(`req.body.`);
    console.log(req.body);

    let notes = await fs.readFile('Develop/db/db.json', 'utf8')

    console.log('objects taken from json')
    console.log(notes)

    const newSavedNotes = JSON.parse(notes);
    const notesId = newSavedNotes[newSavedNotes.length - 1].id
    req.body.id = notesId + 1
    newSavedNotes.push(req.body);
    fs.writeFile('Develop/db/db.json', JSON.stringify(newSavedNotes)).then(function(){

            console.log('note has been saved to json')
            res.json(req.body);
        }).catch(err => console.log(err))
});

app.get('/api/notes', async(req, res) =>{
    
    let notes = await fs.readFile('Develop/db/db.json', 'utf8')
    console.log(notes)
    res.json(JSON.parse(notes));
})

app.delete('/api/notes/:id', async function(req, res){

    const chosen = req.params.id;
    console.log(chosen, "what is happening")
    id = JSON.parse(chosen)
    console.log(id);
    let notes = await fs.readFile('Develop/db/db.json', 'utf8')

    console.log(notes, 'logging notes')

    var newNotes = JSON.parse(notes).filter((item) => item.id !== id);
    
    console.log(newNotes, 'logging new notes')
    fs.writeFile('Develop/db/db.json', JSON.stringify(newNotes))
        .then(()=>{
            res.json(newNotes);
        })
        console.log(`note with id of ${id} deleted from json`);
})


//Port listening
app.listen(PORT, () => {
    console.log('app listening on PORT' + PORT)
})
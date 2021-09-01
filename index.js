const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const Greetings = require('./greetings-factory');
const { Pool } = require('pg');
// Pool.connect()

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(session({
    secret : "add a secret string here",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

app.use(express.static('public'));

// var pool = local;
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
};

const connectionString = process.env.DATABASE_URL ||
'postgresql://coding:codex123@localhost:5432/users';

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const greeting = Greetings(pool);
console.log(pool);

app.get('/', function(req, res){
    res.render('index');
});

app.get('/', async function (req, res) {
    res.render('index', { 
        greetedTimes: await greeting.Table() 
    });
});

app.post('/greet', async function (req, res, next) {

        try {
        let language = req.body.language;
        let names = req.body.textBoxBttn;

        if (language == undefined && names == "") {
            req.flash('info', 'Please enter the name and select language!')
        }
        else if (language == undefined) {
            req.flash('info', 'Please select a language!');
        } else if (names == "") {
            req.flash('info', 'Please enter a valid name!')
        } else {
            greeting.setName(names)
            greeting.greetMessage(language, names)
        };
        greeting.getNames()
        res.render('index', { 
            greetMe: greeting.getGreet(),
            count: greeting.greetCounter()
        });
    }catch(error){
        next(error);
    }

    // console.log(count);
});

// app.get('/greeted', async function(req, res){
//     res.render('greeted',{
//     namesList: await greeting.greetCounter()
//     });
// });

app.post('/counter', async function(req,res){
    res.render('greeted', {
        namesList: greeting.greetCounter()
    });
});

app.get('/counter/:username', function(req, res){
    var name = req.params.username
    let grtNames = greeting.getNames()
    res.render("counter", { 
        username: name,
        greetedTimes: grtNames[name]
})
});

app.get('/', function(req,res){
    res.render('greeted')
});
app.get('/greeted', function(req, res){
       var namesList = greeting.getNames() 
    res.render('greeted', {namesList})
});

app.get("/greeted", async (req, res) => {
    res.render("greeted", {
        namesList: await greeting.getMessage()
    })
})
    
app.post('/home', function (req, res) {
    res.redirect('/')
})
app.post('/clear', async function (req, res) {
    req.flash('info', 'Database deleted successfully');
    await greeting.mydatabase();
    res.render('greeted');
});

app.post('/reset',async function (req, res) {
        req.flash('info', 'Database deleted successfully');
        await greeting.mydatabase();
        res.redirect('/');
});

let PORT = process.env.PORT || 2018;
app.listen(PORT, function(){
    console.log('App started at port', PORT);
})
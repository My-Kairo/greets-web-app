const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const Greetings = require('./greetings-factory');
// const { Pool } = require('pg');
// const timeout = require('connect-timeout');

const app = express();
// let count = 0;

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

// app.use(timeout(3000));

app.get('/', function(req, res){
    res.render('index');
    // count
})

const greeting = Greetings();

// app.get('/', async function (req, res) {
//     res.render('index', { 
//         greetMe: greeting.getGreet(), 
//         // greetedTimes: await greeting.() 
//     });
    
// });


app.post('/greet', function (req, res) {

        
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
            greeting.greetMessage(language, names);
            // greeting.setName(names)
        };
        greeting.getNames()
        res.render('index', { 
            greetMe: greeting.getGreet(),
            count: greeting.greetCounter()
        });

    // console.log(count);
})

// app.get('/greeted', function(req, res){
//     res.render('greeted',{
//     count: greeting.greetCounter()
// })
// })

app.post('/counter', async function(req,res){
    res.render('greeted', {
        model: greeting.greetCounter()
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
})
app.get('/greeted', function(req, res){
       var namesList = greeting.getNames() 
    res.render('greeted', {namesList})
})
app.post('/home', function(req, res){
    res.render('index');
});
app.post('/clear', function(req, res){
    res.render('home');
});

let PORT = process.env.PORT || 2018;
app.listen(PORT, function(){
    console.log('App started at port', PORT)
});
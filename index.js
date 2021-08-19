const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const Greetings = require('./greetings-factory');
// const { Pool } = require('pg');

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


// let useSSL = false;
// let local = process.env.LOCAL || false;
// if (process.env.DATABASE_URL && !local) {
//     useSSL = true;
// }

// const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/users';

// const pool = new Pool({
//     connectionString: connectionString,
//     ssl: {
//         rejectUnauthorized: false
//     }

// });
// const greeting = Greetings(pool);
// console.log(pool);

// app.get('/', async function (req, res) {
//     res.render('index', {
//         greetedTimes: await greeting.poolTable()
//     })
// })

// app.post('/greetings-factory', async function (req, res, next) {

//     try {
//         let hello = req.body.language;
//         let string = req.body.textBoxBttn;
//         if (hello == undefined && string == "") {
//             req.flash('info', 'Please enter the name!')
//         }
//         else if (hello == undefined) {
//             req.flash('info', 'Please select a language!');
//         } else if (string == "") {
//             req.flash('info', 'Please enter a valid name!')
//         } else {
//             greeting.greetMessage(hello, string);
//             await greeting.poolName(string);
//         };
//         res.render('index', { 
//             greetMe: greeting.getGreet(), 
//             greetedTimes: await greeting.poolTable() 
//         });
//     } catch (error) {
//         next(error);

//     }
// })

// app.get("/greeted", async (req, res) => {
//     res.render("greeted", { model: await greeting.greeted() });
// });

// app.get('/counter/:userName', async function(req, res){
//     var name = req.params.userName;
//     res.render("counter", { name: await greeting.getUserName(name) });
// })

// app.post('/reset',async function (req, res) {
//     req.flash('info', 'Database deleted successfully');
//     await greeting.emptyDB();
//     res.redirect('/');
// })

// app.post('/clear', async function (req, res) {
//     req.flash('info', 'Database deleted successfully');
//     await greeting.emptyDB();
//     res.render('greeted');
// })

// app.post('/home', function (req, res) {
//     res.redirect('/')
// })

let PORT = process.env.PORT || 2018;
app.listen(PORT, function(){
    console.log('App started at port', PORT)
})

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const Greetings = require("./greetings-factory");
const greetRouting = require('./routes/routes')
const pg = require("pg");
const Pool = pg.Pool;

const app = express();

// should we use a SSL connection
let useSSL = false;

let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://codex:pg123@localhost:5432/greeting";

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("DataBase connection OK");
});

const greeting = Greetings(pool);
const route = greetRouting(greeting);
// console.log(pool);

const handlebarSetup = exphbs({
  partialsDir: "./views/partials",
  viewPath: "./views",
  layoutsDir: "./views/layouts",
});
// initialise session middleware - flash-express depends on it
app.use(
  session({
    secret: "Error messages",
    resave: false,
    saveUninitialized: true,
  })
);

// initialise the flash middleware
app.use(flash());
app.engine("handlebars", handlebarSetup);
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get("/",route.defaultPG);

app.get("/", route.homePage);

app.post("/greet", route.errorMessages);

app.post("/greet", route.nameList);

app.get("/greeted", route.gettingNames);

app.get("/counter/:username", route.userName);

app.post("/home", route.backRoute);

app.post("/clear", route.deleteList);

app.post("/reset", route.deleteDB);

let PORT = process.env.PORT || 1810;
app.listen(PORT, function () {
  console.log("App started at port, PORT");
});

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const Greetings = require("./greetings-factory");
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

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/", async function (req, res) {
  try {
    res.render("index", {
      greetedTimes: await greeting.poolTable(),
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/greet", async function (req, res, next) {
  try {
    let language = req.body.language;
    let names = req.body.textBoxBttn;

    if (language == undefined && names == "") {
      req.flash("info", "Please enter the name and select language!");
      res.render("index", {
        count: await greeting.poolTable(),
      });
    } else if (language == undefined) {
      req.flash("info", "Please select a language!");
      res.render("index", {
        count: await greeting.poolTable(),
      });
    } else if (names == "") {
      req.flash("info", "Please enter a valid name!");
      res.render("index", {
        count: await greeting.poolTable(),
      });
    } else {
      greeting.greetMessage(language, names);
      await greeting.setNames(names);
      res.render("index", {
        greetMe: greeting.getGreet(),
        count: await greeting.poolTable(),
      });
      // greeting.greetMessage(language, names)
    }
    // greeting.getNames()
    // console.log(greeting.Table());
  } catch (error) {
    next(error);
  }
});

app.post("/greet", async function (req, res) {
  var namesList = await greeting.getNames();
  res.render("greeted", { namesList });
});

app.get("/greeted", async function (req, res) {
  try {
    var nameList = await greeting.getNames();
    // console.log(nameList)
    res.render("greeted", {
      namesList: nameList,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/counter/:username", async function (req, res) {
  var name = req.params.username;
  let grtNames = await greeting.getUserName(name);
  console.log(grtNames);
  res.render("counter", {
    username: name,
    greetedTimes: grtNames,
  });
});

app.post("/home", function (req, res) {
  res.redirect("/");
});
app.post("/clear", async function (req, res) {
  try {
    req.flash("info", "Database deleted successfully");
    await greeting.mydatabase();
    res.render("greeted");
  } catch (error) {
    console.log(error);
  }
});

app.post("/reset", async function (req, res) {
  try {
    req.flash("info", "Database deleted successfully");
    await greeting.mydatabase();
    res.redirect("index");
  } catch (error) {
    console.log(error);
  }
});

let PORT = process.env.PORT || 1810;
app.listen(PORT, function () {
  console.log("App started at port, PORT");
});

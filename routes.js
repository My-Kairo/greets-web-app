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
    }
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
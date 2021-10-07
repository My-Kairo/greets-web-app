module.exports()= function greetRoutes(greeting){

  function defaultPG(req, res) {
    res.render("index");
  }

  async function homePage (req, res) {
    try {
      res.render("index", {
        greetedTimes: await greeting.poolTable(),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function errorMessages(req, res, next) {
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
  }

  async function nameList(req, res) {
    var namesList = await greeting.getNames();
    res.render("greeted", { namesList });
  }

  async function gettingNames(req, res) {
    try {
      var nameList = await greeting.getNames();
      // console.log(nameList)
      res.render("greeted", {
        namesList: nameList,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function userName(req, res) {
    var name = req.params.username;
    let grtNames = await greeting.getUserName(name);
    console.log(grtNames);
    res.render("counter", {
      username: name,
      greetedTimes: grtNames,
    });
  }

  function backRoute(req, res) {
    res.redirect("/");
  }

  async function deleteList(req, res) {
    try {
      req.flash("info", "Database deleted successfully");
      await greeting.mydatabase();
      res.render("greeted");
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteDB(req, res) {
    try {
      req.flash("info", "Database deleted successfully");
      await greeting.mydatabase();
      res.redirect("index");
    } catch (error) {
      console.log(error);
    }
  }

  return{
    defaultPG,
    homePage,
    errorMessages,
    nameList,
    gettingNames,
    userName,
    backRoute,
    deleteList,
    deleteDB
    
  }
}
module.exports = function Greeting(local) {

    var namesList = {};
    var greetMe = "";
    var pool = local;
    

    async function TheName(user) { 
        if (user != '' && /^[a-zA-Z]+$/.test(user)) {
            var name = user[0].toUpperCase() + user.slice(1).toLowerCase();
            const sql = await pool.query(`SELECT * FROM greetings WHERE username = $1`, [name]);
    
            if (sql.rows.length == 0) {
                await pool.query(`insert into greetings (username, greetedTimes) values ($1, $2)`, [name, 1]);
                } else {
                    await pool.query(`UPDATE greetings SET greetedTimes = greetedTimes + 1 WHERE username = $1`, [name])
                    }
        }
    }
// store names into the object
    function setName(name) {
        // if (string != '' && /^[a-zA-Z]+$/.test(string)) {
        //     var name = string[0].toUpperCase() + string.slice(1).toLowerCase();
        if(namesList[name]===undefined){
            namesList[name] = 1
        }else{
            namesList[name]++
        }
    }


    function greetMessage(language, names) {
        setName(names);
        
        if (language === "English") {
            greetMe = "Hello, " + names[0].toUpperCase() + names.slice(1).toLowerCase();
        } else if (language === "Sesotho") {
            greetMe = "Dumela, " + names[0].toUpperCase() + names.slice(1).toLowerCase();
        } else if (language === "IsiXhosa") {
            greetMe = "Molo, " + names[0].toUpperCase() + names.slice(1).toLowerCase();
        }
    }

    function greetCounter() {
        return Object.keys(namesList).length;
    }

    function getNames() {
        return namesList;
    }

    function getGreet() {
        return greetMe;
    }

    async function Table(){
        const sqlCount = await pool.query("SELECT COUNT(*) FROM greetings");
        return sqlCount.rows[0].count;
    }

    async function greeted(){
        const sqlCount = await pool.query("SELECT * FROM greetings ORDER BY userName");
        return sqlCount.rows;
    }

    async function mydatabase() {
        await pool.query("DELETE FROM greetings");
    }

    async function getUserName(name){
        const sqldb = await pool.query("SELECT * FROM greetings WHERE userName = $1", [name])
        return sqldb.rows;
    }
    
    return {
        setName,
        greetCounter,
        getNames,
        greetMessage,
        getGreet,
        TheName,
        Table,
        greeted,
        mydatabase,
        getUserName
    }
}
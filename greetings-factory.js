module.exports = function Greeting(local) {

    var namesList = {};
    var greetMe = "";
    var pool = local;
    

    async function namesFromDB(user) { 
        
        if (user != '' && /^[a-zA-Z]+$/.test(user)) {
            var name = user[0].toUpperCase() + user.slice(1).toLowerCase();
            const sql = await pool.query('select * from greet where username = $1', [name]);
    
            if (sql.rows.length == 0) {
                await pool.query('insert into greet (username, counter_) values ($1, $2)', [name, 1]);
                } else {
                    await pool.query('update greet set counter_ = counter_ + 1 where username = $1', [name])
                    }
        }
    }
// store names into the object
    function setName(name) {
        // if (name != '' && /^[a-zA-Z]+$/.test(name)) {
        //     var name = name[0].toUpperCase() + name.slice(1).toLowerCase();
        if(namesList[name]===undefined){
            namesList[name] = 1
        }else{
            namesList[name]++
        }
    }


    function greetMessage(language, names) {
        setName(names);
        
        if (language === 'English') {
            greetMe = 'Hello, ' + names[0].toUpperCase() + names.slice(1).toLowerCase();
        } else if (language === 'Sesotho') {
            greetMe = 'Dumela, ' + names[0].toUpperCase() + names.slice(1).toLowerCase();
        } else if (language === "IsiXhosa") {
            greetMe = 'Molo, ' + names[0].toUpperCase() + names.slice(1).toLowerCase();
        }
    }

    function greetCounter() {
        return Object.keys(namesList).length;
    }

    async function getNames() {
        const slctdNames = await pool.query('select username from greet');
        return slctdNames.rows;
    }

    function getGreet() {
        return greetMe;
    }

    async function Table(){
        const sqlCount = await pool.query('select count(*) from greet');
        return sqlCount.rows[0].count;
    }

    async function greeted(){
        const sqlCount = await pool.query('select * from greet');
        return sqlCount.rows;
    }

    async function mydatabase() {
        await pool.query("delete from greet");
    }

    async function getUserName(name){
        const sqldb = await pool.query('select * from greet where username = $1', [name])
        return sqldb.rows[0].counter_;
    }
    
    return {
        setName,
        greetCounter,
        getNames,
        greetMessage,
        getGreet,
        namesFromDB,
        Table,
        greeted,
        mydatabase,
        getUserName
    }
}
module.exports = function Greeting(local) {

    var namesList = {};
    var greetMe = "";
    var pool = local;
    

    async function setNames(user) { 
        
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

    function greetMessage(language, names) {
        // setNames(names);
        
        if (language === 'English') {
            greetMe = 'Hello, ' + names[0].toUpperCase() + names.slice(1).toLowerCase();
        } else if (language === 'Sesotho') {
            greetMe = 'Dumela, ' + names[0].toUpperCase() + names.slice(1).toLowerCase();
        } else if (language === "IsiXhosa") {
            greetMe = 'Molo, ' + names[0].toUpperCase() + names.slice(1).toLowerCase();
        }
    }

    // function greetCounter() {
    //     return Object.keys(namesList).length;
    // }

    async function getNames() {
        const slctdNames = await pool.query('select username from greet');
        return slctdNames.rows;
    }

    function getGreet() {
        return greetMe;
    }

    async function poolTable(){
        const sqlCount = await pool.query('select count(*) from greet');
        console.log(sqlCount.rows[0]);
        return sqlCount.rows[0].count;
    }

    async function greeted(){
        const sqlCount = await pool.query('select * from greet');
        return sqlCount.rows;
    }

    async function getUserName(name){
        const sqldb = await pool.query('select * from greet where username = $1', [name])
        return sqldb.rows[0].counter_;
    }

    async function mydatabase() {
        await pool.query('delete from greet');
    }
    
    return {
        // greetCounter,
        getNames,
        greetMessage,
        getGreet,
        setNames,
        poolTable,
        greeted,
        mydatabase,
        getUserName
    }
}
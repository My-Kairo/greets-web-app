// function Greetings(greetingNames){

//     var list = greetingNames || [];
//     // var theCounter = 0;

//     function setnames(name){
//         var name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
//         if(!list.includes(name)){
//             list.push(name);
//         }else {
//             return
//         }
//     }

//     function greet(select, name){
//         name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        
//         if(select === "English") {
//             return "Hello, " + name;
//         }else if (select === "Sesotho"){
//             return "Dumela, " + name;
//         }else if(select === "Isixhosa"){
//             return "Molo, " + name;
//         }
    
//     }

//     function theCounter(){
//         return list.length;
//     }

//     function getnames(){
//         return list;
//     }

//     return{
//         greet,
//         theCounter,
//         setnames,
//         getnames,
//     }

// }


module.exports = function Greeting(local) {

    var namesList = [];
    namesList = local
    var message = "";
    var greetMe = "";
    var pool = local;

    async function poolName(poolUser) {
        if (poolUser != '' && /^[a-zA-Z]+$/.test(poolUser)) {
            var name = poolUser[0].toUpperCase() + poolUser.slice(1).toLowerCase();
            const sql = await pool.query(`SELECT * FROM Users WHERE userName = $1`, [name]);
            if (sql.rows.length == 0) {
                await pool.query(`insert into Users (userName, greetedTimes) values ($1, $2)`, [name, 1]);
            } else {
                await pool.query(`UPDATE Users SET greetedTimes = greetedTimes + 1 WHERE userName = $1`, [name])
            }
        }
    }

    function setName(string) {
        if (string != '' && /^[a-zA-Z]+$/.test(string)) {
            var name = string[0].toUpperCase() + string.slice(1).toLowerCase();
            if (!namesList.includes(name)) {
                namesList.push(name)
            } else {
                message = "Name already greeted!";
            }
        }
    }
    function greetMessage(hello, string) {
        if (hello === "English") {
            greetMe = "Helo, " + string[0].toUpperCase() + string.slice(1).toLowerCase();
        } else if (hello === "Sesotho") {
            greetMe = "Dumela, " + string[0].toUpperCase() + string.slice(1).toLowerCase();
        } else if (hello === "IsiXhosa") {
            greetMe = "Molo, " + string[0].toUpperCase() + string.slice(1).toLowerCase();
        }
    }
    function greetCounter() {
        return namesList.length;
    }
    function getNames() {
        return namesList;
    }
    function firstL(string, names) {
        if (string != '' && names != '' && /^[a-zA-Z]+$/.test(string)) {
            return names + string[0].toUpperCase() + string.slice(1).toLowerCase();
        }
    }
    function getMessage() {
        return message;
    }
    function getGreet() {
        return greetMe;
    }
    function emptyList() {
        emptyListnamesList = [];
    }
    async function poolTable(){
        const sqlCount = await pool.query("SELECT COUNT(*) FROM users");
        return sqlCount.rows[0].count;
    }

    async function greeted(){
        const sqlCount = await pool.query("SELECT * FROM users ORDER BY userName");
        return sqlCount.rows;
    }

    async function emptyDB() {
        await pool.query("DELETE FROM users")
    }
    async function getUserName(name){
        const sqldb = await pool.query("SELECT * FROM users WHERE userName = $1", [name])
        return sqldb.rows;
    }
    return {
        getUserName,
        setName,
        greeted,
        greetCounter,
        getNames,
        firstL,
        getMessage,
        greetMessage,
        getGreet,
        emptyList,
        poolName,
        emptyDB,
        poolTable
    }
}
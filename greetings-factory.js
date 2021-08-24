module.exports = function Greeting() {

    var namesList = {};
    var greetMe = "";
    
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
    
    return {
        setName,
        greetCounter,
        getNames,
        greetMessage,
        getGreet,
    }
}
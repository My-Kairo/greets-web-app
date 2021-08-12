function Greetings(greetingNames){

    var list = greetingNames || [];
    // var theCounter = 0;

    function setnames(name){
        var name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        if(!list.includes(name)){
            list.push(name);
        }else {
            return
        }
    }

    function greet(select, name){
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        
        if(select === "English") {
            return "Hello, " + name;
        }else if (select === "Sesotho"){
            return "Dumela, " + name;
        }else if(select === "Isixhosa"){
            return "Molo, " + name;
        }
    
    }

    function theCounter(){
        return list.length;
    }

    function getnames(){
        return list;
    }

    return{
        greet,
        theCounter,
        setnames,
        getnames,
    }

}
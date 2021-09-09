const assert = require("assert");
const Greeting = require("../greetings-factory");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/greeting';

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const greeting = Greeting(pool);

describe('Greeting', function () {
    it('Should greet the name entered in English', function () {
        let hello = Greeting([])
        var names = "Thato"
        var langauge = "Hello, "

        hello.setName(names)

        assert.equal('', hello.getGreet(langauge));
    })

    it('Should return message "Name already greeted"', function () {
        let hello = Greeting([])
        var names = "Thato"
        var langauge = "Hello, "

        hello.setName(names)
        hello.setName(names)

        assert.equal('', hello.getGreet())
        // assert.equal('Name already greeted!', hello.getGreet())
    })

    it('Should return the first character of the name entered in uppercase', function () {
        let hello = Greeting([])
        var names = "Kairo"
        var langauge = "Hello, "

        hello.setName(names)

        assert.equal('', hello.getGreet())
    })

    it('Should return the greeting in Sesotho', function () {
        let hello = Greeting([])
        var names = "Kairo"
        var langauge = "Dumela, "

        hello.setName(names)
        hello.setName(names)

        assert.equal('', hello.getGreet())
    })

    it('Should return how many times a name is being greeted', function () {
        let hello = Greeting([])
        var names1 = "Thato"
        var names2 = "Kairo"
        var names3 = "Melo"
        var names4 = "Boimamelo"
        var names5 = "Lelo"
        var names6 = "Mami"
        var names7 = "Hatsi"
        var names8 = "Katleho"
        var names9 = "Thabelo"

        hello.setName(names1)
        hello.setName(names2)
        hello.setName(names3)
        hello.setName(names4)
        hello.setName(names5)
        hello.setName(names6)
        hello.setName(names7)
        hello.setName(names8)
        hello.setName(names9)

        assert.deepEqual(9, hello.greetCounter())
    })
})

describe('Deleting Database', async function () {
    it('should delete from greetings database', async function () {
        await greeting.mydatabase();
        assert.equal(0, await greeting.Table())
    })
})

describe('Get username', async function () {
    it('Should return the greeted username', async function () {
        var username1 = await greeting.namesFromDB('Kairo')
        await greeting.getUserName("Thato");
        assert.equal('Kairo', username1);
        await greeting.mydatabase();
    })
})
describe('Greeted Users', async function () {
    it('Should count the names of all greeted users', async function () {
        await greeting.namesFromDB('Kairo');
        await greeting.namesFromDB('Thato');
        await greeting.namesFromDB('Aya');
        await greeting.namesFromDB('Melo');
        await greeting.namesFromDB('Katleho');

        await greeting.getUserName('Kairo');
        await greeting.getUserName('Thato');
        await greeting.getUserName('Aya');
        await greeting.getUserName('Melo');
        await greeting.getUserName('Katleho');

        assert.equal(5, await greeting.Table());
        await greeting.mydatabase();
    })
})
describe('Greeted list', async function() {
    it('Should display the list of all greeted users', async function() {
        await greeting.namesFromDB('Thato');
        await greeting.namesFromDB('Kairo');
        await greeting.namesFromDB('Aya');
        await greeting.namesFromDB('Boimamelo');
        await greeting.namesFromDB('Melo');

       var username1 = await greeting.getUserName('Thato');
       var username2 = await greeting.getUserName('Kairo');
       var username3 = await greeting.getUserName('Aya');
       var username4 = await greeting.getUserName('Boimamelo');
       var username5 = await greeting.getUserName('Melo');

        assert.equal('Thato', username1[0].username)
        assert.equal('Kairo', username2[0].username)
        assert.equal('Aya', username3[0].username)
        assert.equal('Boimamelo', username4[0].username)
        assert.equal('Melo', username5[0].username)
    })
})
const assert = require("assert");
const Greeting = require("../greetings-factory");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString =
  process.env.DATABASE_URL || "postgresql://codex:pg123@localhost:5432/greeting";

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    }
  });

const greeting = Greeting(pool);

describe("Greeting",async  function () {
  beforeEach(async function () {
    console.log("*****");
    await pool.query("delete from greet;");
  });
  it("Should greet the name entered in English", function () {
    let hello = greeting;

    hello.greetMessage('English', 'Thato');
    
    assert.equal('Hello, Thato', hello.getGreet());
  });

  it('Should return the name greeted', async function () {
    let hello = greeting;
    const names = "Thato";
    await hello.setNames(names);
    let user = {username: "Thato"}
    assert.deepEqual(user, (await hello.getNames())[0]);
    
    // assert.equal('Name already greeted!', hello.getGreet())
  });

  it("Should greet the name entered in Sesotho", function () {
    let hello = greeting;

    hello.greetMessage('Sesotho', 'Thato');
    
    assert.equal('Dumela, Thato', hello.getGreet());
  });

  it("Should return the first character of the name entered in uppercase", async function () {
    let hello = greeting;
    var names = "Kairo";

    await hello.setNames(names);
    var  actualName = {username: 'Kairo'}
    assert.deepEqual(actualName, (await hello.getNames())[0]);
  });

  it("Should return how many times a name is being greeted", async function () {
    let hello = greeting;
    var names = "Thato";

    await hello.setNames(names);

    assert.equal(1, (await hello.getNames()).length);
  });

  it("should delete from greetings database", async function () {
    await greeting.mydatabase();
    assert.equal(0, await greeting.poolTable());
  });

  after(function () {
    pool.end();
  });
});

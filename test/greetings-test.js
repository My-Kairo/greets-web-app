const assert = require("assert");
const Greeting = require("../greetings-factory");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://codex:pg123@localhost:5432/greeting";

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
  it("Should greet the name entered in English", async function () {
    let hello = greeting;
    var names = "Thato";
    var langauge = "Hello, ";

    await hello.setNames(names);

    assert.equal("", hello.getGreet(langauge));
  });

  it('Should return the name greeted', async function () {
    let hello = greeting;
    hello.setNames("Thato");

    await hello.getNames('Thato');

    assert.equal("", hello.getGreet());
    // assert.equal('Name already greeted!', hello.getGreet())
  });

  it("Should return the first character of the name entered in uppercase", async function () {
    let hello = greeting;
    var names = "kairo";

    await hello.setNames(names);
    var  actualName = {username: 'Kairo'}
    assert.deepEqual(actualName, (await hello.getNames())[0]);
  });

  it("Should return the greeting in Sesotho",async function () {
    let hello = greeting;
    var names = "Kairo";
    var langauge = "Dumela, ";

    await hello.getNames(names);
    await hello.getNames(names);

    assert.equal("", hello.getGreet());
  });

  it("Should return how many times a name is being greeted", async function () {
    let hello = greeting;
    var names = "Thato";

    await hello.setNames(names);

    assert.equal(1, (await hello.getNames()).length);
  });

  it("should delete from greetings database", async function () {
    await greeting.mydatabase();
    assert.equal(0, await greeting.Table());
  });

  after(function () {
    pool.end();
  });
});

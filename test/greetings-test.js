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

  it("Should return the first character of the name entered in uppercase", async function () {
    await pool.query("delete from greet;");
    let hello = greeting;
    var names = "Kairo";

    await hello.setNames(names);
    var  actualName = {username: 'Kairo'}
    assert.deepEqual(actualName, (await hello.getNames())[0]);
  });

  it("Should greet the name entered in English", function () {
    let hello = greeting;

    hello.greetMessage('English', 'Thato');
    
    assert.equal('Hello, Thato', hello.getGreet());
  });

  it('Should return the name greeted', async function () {
    await pool.query("delete from greet;");
    let hello = greeting;
    const names = "Thato";
    await hello.setNames(names);
    let user = {username: names}
    assert.deepEqual(user, (await hello.getNames())[0]);
  });

  it("Should return how many times a name is being greeted", async function () {
    await pool.query("delete from greet;");
    let hello = greeting;
    var names = "Thato";
    var nms = "Hatsi"

    await hello.setNames(names);
    await hello.setNames(nms);

    assert.equal(2, (await hello.getNames()).length);
  });

  it("Should return names greeted with counters", async function(){
    await pool.query("delete from greet;");
    let hello = greeting;

    (await hello.getUserName("Thato").counter_);
   (await hello.getUserName("Kairo").counter_);
    (await hello.getUserName("Boimamelo").counter_);

    assert.equal([], (await hello.getNames()).length)
  });

  it("Should add data into the database", async function(){
    await pool.query("delete from greet;");
    let hello = greeting;
    await hello.getUserName("Hatsi").counter_
    await hello.getUserName("Tsoho").counter_
    await hello.getUserName("Bonny").counter_
    await hello.getUserName("Luks").counter_

    assert.equal([0], await hello.poolTable())
  });

  it("should delete from greetings database", async function () {
    await greeting.mydatabase();
    assert.equal(0, await greeting.poolTable());
  });

  after(function () {
    pool.end();
  });
});

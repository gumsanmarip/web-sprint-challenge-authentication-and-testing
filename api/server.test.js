const db = require("../data/dbConfig");
const request = require("supertest");
const server = require("./server");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});

//Register
test("[POST] /register", async () => {
  const res = await request(server)
    .post("/api/auth/register")
    .send({ username: "gumsanm", password: "password" });
  expect(res.status).toBe(201);
});

test("[POST] /register id", async () => {
  let res = await request(server)
    .post("/api/auth/register")
    .send({ username: "gumsanm", password: "foobar" });

  expect(res.body).toHaveProperty("username", "gumsanm");
});

//Login
test("[POST] /login error", async () => {
  let res = await request(server)
    .post("/api/auth/login")
    .send({ username: "gumsanm", password: "foobar" });

  expect(res.body).toMatchObject({ message: "Invalid credentials" });
});

test("[POST] /login error for empty username or password", async () => {
  let res = await request(server)
    .post("/api/auth/login")
    .send({ username: "gumsanm" });

  expect(res.body).toMatchObject({
    message: "username and password required",
  });
});

//Jokes
test("[GET] /no jokes", async () => {
  let res = await request(server).get("/api/jokes");
  expect(res.body).toMatchObject({ message: "token required" });
});

test("[GET] /no jokes no token ", async () => {
  const res = await request(server).get("/api/jokes");
  expect(res.body).toMatchObject({ message: "token required" });
});

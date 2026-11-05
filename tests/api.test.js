const request = require("supertest");
const app = require("../src/app");
const pool = require("../src/db/pool");

// Email distinto cada vez para que no choque con el test anterior 
const email = `test-${Date.now()}@example.com`;
let authorId;

afterAll(() => pool.end());

test("POST /authors crea un author → 201", async () => {
  const res = await request(app).post("/authors").send({ name: "Autor de Prueba", email });
  authorId = res.body.id;
  expect(res.statusCode).toBe(201);
});

test("GET /authors/:id devuelve el author → 200", async () => {
  const res = await request(app).get(`/authors/${authorId}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.email).toBe(email);
});

test("POST /authors sin name → 400", async () => {
  const res = await request(app).post("/authors").send({ email: "sin-nombre@example.com" });
  expect(res.statusCode).toBe(400);
});

test("POST /authors con email repetido → 400", async () => {
  const res = await request(app).post("/authors").send({ name: "Otro", email });
  expect(res.statusCode).toBe(400);
});

test("POST /posts crea un post → 201", async () => {
  const res = await request(app).post("/posts").send({ title: "Post de Prueba", content: "Contenido", author_id: authorId });
  expect(res.statusCode).toBe(201);
});

test("GET /posts/author/:authorId trae sus posts con el author → 200", async () => {
  const res = await request(app).get(`/posts/author/${authorId}`);
  expect(res.statusCode).toBe(200);
  expect(res.body[0].author_name).toBe("Autor de Prueba");
});

test("DELETE /authors/:id borra el author → 204", async () => {
  const res = await request(app).delete(`/authors/${authorId}`);
  expect(res.statusCode).toBe(204);
});

test("DELETE /posts/:id inexistente → 404", async () => {
  const res = await request(app).delete("/posts/999999");
  expect(res.statusCode).toBe(404);
});
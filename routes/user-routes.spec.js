const server = require("../server/server.js");
const request = require("supertest");
const db = require("../data/dbConfig");

beforeAll(async done => {
  // reset db
  await db.migrate.rollback();
  await db.migrate.latest();
  await db.seed.run();
  return done();
});
// !! note: we are seeding >500 users, half "mothers", "half drivers".
// at the moment these tests are basically integration tests since they are interacting with the database and written to expect seed data to be there.

const testRoute = "/api/users";
const adminTestRoute = "/api/admin/users";

describe("Test Users Routes (non-admin)", () => {
  describe(`GET ${testRoute}`, () => {
    it("Should return 201", async () => {
      const res = await request(server).get(`${testRoute}`);
      expect(res.status).toEqual(201);
    });
  });
  describe(`GET ${testRoute}`, () => {
    it("Should return mother matching firebase_id", async () => {
      const res = await request(server)
        .get(`${testRoute}`)
        .set("Authorization", "motherToken");
      // console.log("HERE", res.body);
      expect(res.body.motherData).toEqual(expect.any(Array));
    });
  });
});

describe("Test Users Routes for Admin", () => {
  describe(`GET ${adminTestRoute}`, () => {
    it("Should return 200 ok and array", async () => {
      const res = await request(server).get(`${adminTestRoute}`);
      expect(res.body).toEqual(expect.any(Array));
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThan(500);
    });

    it("should return 404 if user type is not valid", async () => {
      const res = await request(server).get(`${adminTestRoute}/wrong_type`);
      expect(res.status).toEqual(404);
    });

    describe(`GET ${adminTestRoute}`, () => {
      it("should return 200 and array matching mothers param", async () => {
        const res = await request(server).get(`${adminTestRoute}/mothers`);
        expect(res.body).toEqual(expect.any(Array));
        expect(res.status).toEqual(200);
        expect(res.body.length).toBeGreaterThan(249);
      });
    });

    describe(`GET ${adminTestRoute}`, () => {
      it("should return 200 and array matching drivers param", async () => {
        const res = await request(server).get(`${adminTestRoute}/drivers`);
        expect(res.body).toEqual(expect.any(Array));
        expect(res.status).toEqual(200);
        expect(res.body.length).toBeGreaterThan(249);
      });
    });
  });
});

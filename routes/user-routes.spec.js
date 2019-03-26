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

describe("Test Users Route", () => {
  describe("GET /api/users", () => {
    // note: we are seeding >500 users, half "mothers", "half drivers". get response length check assumes seed file is set up this way.
    it("Should return 200 ok and array", async () => {
      const res = await request(server).get("/api/users");
      console.log(res.status);
      expect(res.body).toEqual(expect.any(Array));
      expect(res.status).toEqual(200);
      expect(res.body.length).toBeGreaterThan(500);
    });

    it("should return 404 if user type is not valid", async () => {
      const res = await request(server).get("/api/users/wrong_type");
      expect(res.status).toEqual(404);
    });

    describe("GET /api/users/mothers", () => {
      it("should return 200 and array matching mothers param", async () => {
        const res = await request(server).get("/api/users/mothers");
        expect(res.body).toEqual(expect.any(Array));
        expect(res.status).toEqual(200);
        expect(res.body.length).toBeGreaterThan(250);
      });
    });

    describe("GET /api/users/drivers", () => {
      it("should return 200 and array matching drivers param", async () => {
        const res = await request(server).get("/api/users/drivers");
        expect(res.body).toEqual(expect.any(Array));
        expect(res.status).toEqual(200);
        expect(res.body.length).toBeGreaterThan(250);
      });
    });
  });
});

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

const testRoute = "/api/users";
const adminTestRoute = "/api/admin/users";

describe("Test Users Routes (non-admin)", () => {
  describe(`GET ${testRoute}`, () => {
    it("Should return 201 ok and json", async () => {
      const res = await request(server).get(`${testRoute}`);
      expect(res.status).toEqual(201);
    });
  });
});

describe("Test Users Routes for Admin", () => {
  describe(`GET ${adminTestRoute}`, () => {
    // note: we are seeding >500 users, half "mothers", "half drivers". get response length check assumes seed file is set up this way.
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
        expect(res.body.length).toBeGreaterThan(250);
      });
    });

    describe(`GET ${adminTestRoute}`, () => {
      it("should return 200 and array matching drivers param", async () => {
        const res = await request(server).get(`${adminTestRoute}/drivers`);
        expect(res.body).toEqual(expect.any(Array));
        expect(res.status).toEqual(200);
        expect(res.body.length).toBeGreaterThan(250);
      });
    });
  });
});

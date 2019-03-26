const request = require("supertest");
const admin = require("firebase-admin");
// note: don't test firebase-admin, use mock
// jest.mock("firebase-admin");

const protect = require("./auth-mw");

describe("Test protect middleware", () => {
  const token = "token here";
  // more stuff returned in real life
  const tokenDecodedGoogle = {
    name: "Birth Ride",
    firebase: { sign_in_provider: "google.com" }
  };
  const tokenDecodedPhone = {
    phone_number: "+8885558585",
    firebase: { sign_in_provider: "phone" }
  };
  it("checks token provided on auth header", () => {
    // admin
    // .auth()
    // .verifyIdToken(goodToken)
    // .mockResolvedValue(tokenDecodedGoogle);
    const res = request(protect)
      .get("/anything")
      .set("Authorization", token)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
    expect(res).toBe(next());
  });
});

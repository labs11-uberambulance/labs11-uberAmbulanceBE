const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByUserType,
  findMothers,
  findDrivers
};
function find() {
  return db("users").select("id", "name");
}
function findBy(filter) {
  return db("users").where(filter);
}
async function findMothers() {
  try {
    const moms = await db("users").where({ user_type: "mothers" });
    const mothers = moms.map(element => {
      return findByUserType(element);
    });
    return mothers;
  } catch (error) {
    throw new Error("Could not find any mothers");
  }
}
async function findDrivers() {
  try {
    const driv = await db("users").where({ user_type: "drivers" });
    const drivers = driv.map(element => {
      return findByUserType(element);
    });
    return drivers;
  } catch (error) {
    throw new Error("Could not find any mothers");
  }
}
async function findByUserType(user) {
  try {
    const google_id = user.google_id;
    const type = user.user_type;
    const userTypeData = await db(`${type}`)
      .where({ google_id })
      .first();
    return { user, userTypeData };
  } catch (error) {
    throw new Error("Could not retrieve usertype information");
  }
}
async function add(user) {
  const [id] = await db("users").insert(user, "id");
  return findById(id);
}
async function findById(id) {
  const user = await db("users")
    .select("id", "name", "phone")
    .where({ id })
    .first();
  console.log(user);
  return user;
}

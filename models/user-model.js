const db = require("../data/dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  findByUserType,
  findMothers,
  findDrivers,
  remove,
  register
};
function find() {
  return db("users").select("id", "name");
}
function findBy(filter) {
  return db("users").where(filter);
}
async function findMothers() {
  try {
    const moms = await db("users")
      // .select(
      //   "id",
      //   "name",
      //   "login",
      //   "google_id",
      //   "phone"
      //   "mothers.address",
      //   "mothers.village",
      //   "mothers.caretaker_name",
      //   "mothers.due_date",
      //   "mothers.hospital",
      //   "mothers.email"
      // )
      // .from("users")
      .innerJoin("mothers", "mothers.google_id", "users.google_id")
      .where({ user_type: "mothers" });
    return moms;
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

function remove(id) {
  return db("users")
    .where({ id: id })
    .del();
}

// Registration and Login

async function register(user) {
  const [id] = await db("users").insert(user, "id");
  const registered = await db("users").where({ id });
  return registered;
}

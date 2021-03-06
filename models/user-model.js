const db = require("../data/dbConfig.js");

module.exports = {
  add,
  addMother,
  addDriver,
  find,
  findBy,
  findById,
  findByUserType,
  findMothers,
  findMothersBy,
  findDrivers,
  findDriversBy,
  remove,
  register,
  updateUser,
  updateMother,
  updateDriver
};
async function add(user) {
  const [id] = await db("users").insert(user, "id");
  return findById(id);
}
async function addMother(mother) {
  const [id] = await db("mothers").insert(mother, "id");
  return findMothersBy({ id });
}
async function addDriver(driver) {
  const [id] = await db("drivers").insert(driver, "id");
  return findDriversBy({ id });
}
function find() {
  return db("users").select("id", "name");
}
function findBy(filter) {
  return db("users").where(filter);
}
async function findMothers() {
  try {
    const moms = await db("users")
      .innerJoin("mothers", "mothers.firebase_id", "users.firebase_id")
      .where({ user_type: "mothers" });
    return moms;
  } catch (error) {
    throw new Error("Could not findMothers");
  }
}
async function findMothersBy(filter) {
  // console.log("Filter: ", filter);
  try {
    const moms = await db("mothers").where(filter);
    return moms;
  } catch (error) {
    throw new Error(`Could not findMothersBy(${filter})`);
  }
}
async function findDrivers() {
  try {
    const drivers = await db("users")
      .innerJoin("drivers", "drivers.firebase_id", "users.firebase_id")
      .where({ user_type: "drivers" });
    return drivers;
  } catch (error) {
    throw new Error("Could not find any drivers");
  }
}
async function findDriversBy(filter) {
  try {
    const drivers = await db("drivers").where(filter);
    return drivers;
  } catch (error) {
    throw new Error(`Could not findDriversBy(${filter})`);
  }
}
async function findByUserType(user) {
  try {
    const firebase_id = user.firebase_id;
    const type = user.user_type;
    const userTypeData = await db(`${type}`)
      .where({ firebase_id })
      .first();
    return { user, userTypeData };
  } catch (error) {
    throw new Error("Could not retrieve usertype information");
  }
}
async function findById(id) {
  const user = await db("users")
    .where({ id })
    .first();
  // console.log(user);
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

async function updateUser(filter, userData) {
  // console.log(filter, userData);
  const updatedId = await db("users")
    .where(filter)
    .update(userData, ["id"]);
  return updatedId;
}

async function updateMother(filter, motherData) {
  // console.log(filter, motherData);
  const updatedId = await db("mothers")
    .where(filter)
    .update(motherData, ["id"]);
  return updatedId;
}

async function updateDriver(filter, driverData) {
  const updatedId = await db("drivers")
    .where(filter)
    .update(driverData, ["id"]);
  return updatedId;
}

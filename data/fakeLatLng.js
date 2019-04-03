const faker = require("faker");

module.exports = function latLng() {
  // *** constructing latlng
  // Uganda between -1.4, 4.2
  // INSTEAD using boundaries: 0.3, 1.1 (safemothers service area)
  const latitude = faker.random.number({
    max: 1.1,
    min: 0.3,
    precision: 0.000001
  });
  // Uganda between 29.5, 35.5
  // INSTEAD using boundaries 33.2, 33.9 (safemothers service area)
  const longitude = faker.random.number({
    min: 33.2,
    max: 33.9,
    precision: 0.000001
  });
  return `${latitude},${longitude}`;
};

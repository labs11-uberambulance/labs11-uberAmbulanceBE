# API for BirthRide back end

## labs11-uberAmbulanceBE

# Data Schemas

## User data

Every user who completes OAuth process should have User data, FE (Web, AND, IOS) is responsible for making the appropriate request to the API upon successful completion of OAuth flow.

```js
user = {
  id: 1,
  // int, unique, set internally
  name: "name_here",
  // string
  login: "email/phone_here",
  // string depending on login type
  firebase_id: "firebase_id_here",
  // string required
  phone: "phone_number",
  // string blank if not provided
  user_type: "mothers/drivers"
  // string, blank if onboarding not complete, limited to "mothers" or "drivers"
};
```

## Mother data

Users who complete the "Pregnant Mother" or "Caretaker" onboarding process will have this data, linked to users table by `firebase_id` as foreign key.

```js
mother = {
  id: 1,
  // int, unique, set internally
  firebase_id: "firebase_id_here",
  // string, required, foreign key references users table
  address: "address string",
  // string, 500 char limit, street address or description
  village: "village name",
  // string, must match location findable by google maps API
  latitude: 1.234567,
  // decimal, GPS latitude coord
  longitude: 1.234567,
  // decimal, GPS longitude coord
  caretaker_name: "name_here",
  // string, if provided by completing "Caretaker" onboarding
  due_date: "date string",
  // string, format: YYYY-MM-DD
  hospital: "hospital name",
  // string, must match location findable by google maps API
  email: "email@b.c"
  // string, if provided
};
```

## Driver data

Users who complete the "Driver" onboarding process will have this data, linked to users table by `firebase_id` as foreign key.

```js
driver = {
  id: 1,
  // int, unique, set internally
  firebase_id: "firebase_id_here",
  // string, required, foreign key references users table
  address: "address string",
  // string, 500 char limit, street address or description
  village: "village name",
  // string, must match location findable by google maps API
  latitude: 1.234567,
  // decimal, GPS latitude coord
  longitude: 1.234567,
  // decimal, GPS longitude coord
  email: "email@b.c",
  // string, if provided
  price: 345,
  // int, maximum price for ride
  active: false,
  // bool, driver status (accepting rides?)
  bio: "bio here"
  // string, 500 char limit
};
```

## Ride data

Created when a mother requests a ride.

```js
ride = {
  id: 1,
  // int, unique, set internally
  driver_id: 2,
  // int, foreign key references drivers table
  mother_id: 3,
  // int, foreign key references mothers table
  start_village: "village_name",
  // string, 500 char limit, must be findable by google maps API
  start_address: "address_here",
  // json, street address or description
  destination: "destination_here",
  // string, 500 char limit, must be findable by google maps API
  destination_address: "destination_addy_here",
  // json, street address or description,
  ride_status: "complete"
  // string, indicates current status of ride (en route, complete, etc.)
};
```

# API endpoints

The API publishes the following endpoints to: `https://birthrider-backend.herokuapp.com/`. Except for unprotected `Testing` routes, all routes are protected, requiring `Authorization` header to be set with a valid token produced by OAuth flow, set only the token with no prefix:

```js
Authorization: "eyJhbG...";
```

## Testing

| Method | URL            | Description                                                                                        |
| ------ | -------------- | -------------------------------------------------------------------------------------------------- |
| GET    | /              | Unprotected. Returns JSON: `"Hey there BirthRide Dev!"` if server is running                       |
| GET    | /api/test-auth | Protected. Returns JSON: { message: "The user ${user_identifier} is authorized by ${auth method}}" |

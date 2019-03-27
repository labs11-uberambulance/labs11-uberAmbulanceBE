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
  user_type: "mothers/drivers",
  // string, blank if onboarding not complete, limited to "mothers" or "drivers"
  address: "address string",
  // string, 500 char limit, street address or description
  village: "village name",
  // string, must match location findable by google maps API
  email: "email@b.c",
  // string, if provided
  latitude: 1.234567,
  // decimal, GPS latitude coord
  longitude: 1.234567
  // decimal, GPS longitude coord
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
  caretaker_name: "name_here",
  // string, if provided by completing "Caretaker" onboarding
  due_date: "date string",
  // string, format: YYYY-MM-DD
  hospital: "hospital name"
  // string, must match location findable by google maps API
};
```

## Driver data

Users who complete the "Driver" onboarding process will have this data, linked to users table by `firebase_id` as foreign key.

### Complete driver data

```js
driver = {
  id: 1,
  // int, unique, set internally
  firebase_id: "firebase_id_here",
  // string, required, foreign key references users table
  price: 345,
  // int, maximum price for ride
  active: false,
  // bool, driver status (accepting rides?)
  bio: "bio here"
  // string, 500 char limit
};
```

### Nearest driver data

returned by request to /api/drivers

```js
drivers = [
  {
    id: 1,
    // int, unique, set internally
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
  },
  {
    // driver 2
  }
  // etc.
];
```

## Ride data

Created when a mother requests a ride.

### Complete ride data

```js
ride = {
  id: 1,
  // int, unique, set internally
  driver_id: 2,
  // int, foreign key references drivers table
  mother_id: 3,
  // int, foreign key references mothers table
  wait_min: 3,
  // int, defaults to 20, number of minutes to wait for confirmation/rejection of ride request
  request_time: "time_of_request_to_driver",
  // string, time data accurate to minutes, gets set when a ride request is made to a driver, used with "wait_min" to determine when next driver should be requested
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

### New ride data

submit this data to create a new ride

```js
newRide = {
  driver_id: id,
  // int, required, id of driver to request ride from
  mother_id: id,
  // int, required, id of mother requesting the ride
  wait_min: 3,
  // int, defaults to 20, number of minutes to wait for confirmation/rejection of ride request
  request_time: "time_of_request_to_driver",
  // string, time data accurate to minutes, gets set when a ride request is made to a driver, used with "wait_min" to determine when next driver should be requested
  start_village: "village_name",
  // string, required, 500 char limit, must be findable by google maps API
  start_address: "address_here",
  // json, optional, street address or description
  destination: "destination_here",
  // string, required, 500 char limit, must be findable by google maps API
  destination_address: "destination_addy_here"
  // json, optional, street address or description,
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

## Login/Registration

| Method | URL        | Description                                                                                                                                                                             |
| ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | /api/users | Returns user data matching firebase id found in decoded auth token. If no user is found, a new user will be created. Returns JSON with user data and mother/driver data if it is found. |

## Onboarding

| Method    | URL                    | Description                                                                                                                                                                                                                                                                                                              |
| --------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TODO-POST | /api/users/onboard/:id | User ID expected in request URL. Include `user_type: "type"` and `typeData : { type_data }` in request body where type is `"mother"` or `"driver"` and `type_data` corresponds to the appropriate [mother](##Mother-data) or [driver](##Driver-data) model. Creates a mother or driver with firebase_id matching `user`. |
| TODO-PUT  | /api/users/update/:id  | User ID expected in request URL. Include mother or driver data in request body. Mother/Driver will be updated with request data.                                                                                                                                                                                         |

## Rides

| Method    | URL                 | Description                                                                                                                                                                                                      |
| --------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TODO-POST | /api/drivers        | Include `{ latitude: 1.234, longitude: 1.234 }` in request body. Returns [nearest driver data](###Nearest-driver-data) (ref. data schema above), sorted by nearest first.                                        |
| TODO-POST | /api/rides/new-ride | Include data as found in [new ride data](###New-ride-data) in request body. Creates a new ride and sends request to driver.                                                                                      |
| TODO-GET  | /api/rides/         | Include `{ rideId: id }` in request body. Returns [complete ride data](###complete-ride-data).                                                                                                                   |
| TODO-GET  | /api/rides/         | Include `{ userId: id }` in request body. Returns **`array`** of [complete ride data](###complete-ride-data) matching `userId`.                                                                                  |
| TODO-PUT  | /api/rides/         | Include data in format of [complete ride data](###complete-ride-data), elements not included will not be updated. Updates ride data, returns ride data in format of [complete ride data](###complete-ride-data). |

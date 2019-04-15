# API for BirthRide back end

## labs11-uberAmbulanceBE

# Data Schemas

Note: unless noted, string types are 255 char limit.

## User data

Every user who completes OAuth process should have User data, FE (Web, AND, IOS) is responsible for making the appropriate request to the API upon successful completion of OAuth flow.

```js
user = {
  id: 1,
  // int, unique, set internally
  name: "name_here",
  // string
  firebase_id: "firebase_id_here",
  // string required
  phone: "phone_number",
  // string blank if not provided
  user_type: "mothers/drivers",
  // string, empty if onboarding not complete, limited to "mothers" or "drivers" otherwise
  location: {
    latlng: "lat,lng", // string, lat and long comma separated, no spaces
    name: "location name", // string
    descr: "more info describing location" // string
  }
  // json
  email: "email@b.c",
  // string, if provided
  FCM_token: "token_here",
  // string, token set for users who enable push notifications
  created_at: "time",
  // string, set internally
  updated_at: "time"
  // string, set internally
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
  start: {
    latlng: "lat,lng", // string, lat and long comma separated, no spaces
    name: "location name", // string
    descr: "more info describing location" // string
  }
  // json, where mother's ride will begin
  destination:{
    latlng: "lat,lng", // string, lat and long comma separated, no spaces
    name: "location name", // string
    descr: "more info describing location" // string
  }
  // json, where mother's ride will end
  created_at: "time",
  // string, set internally
  updated_at: "time"
  // string, set internally
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
  bio: "bio here",
  // string, 500 char limit
  photo_url: "http://pic.driver.com"
  // string, 500 char limit
  created_at: "time",
  // string, set internally
  updated_at: "time"
  // string, set internally
};
```

### Nearest driver data

returned by request to /api/drivers

```js
drivers = [
  {
  driver: {
    // Traditional Driver Object, with all their info.
    id: 1,
    name: "Layne Terry",
    firebase_id: "0j9bat5h",
    phone: "760.509.2082 x2045",
    user_type: "drivers",
    location: {
      "latlng": "0.598206,33.24884",
      "name": "Kibuku",
      "descr": "Eius beatae nihil."
    },
    email: "Gudrun52@gmail.com",
    created_at: "2019-04-03T21:46:48.986Z",
    updated_at: "2019-04-03T21:46:48.986Z",
    price: 338,
    active: true,
    bio: "Nobis non quia laudantium iure eos. Rem veritatis consequatur sapiente in. Est velit aut tenetur qui incidunt eius ipsum hic. Enim ipsa voluptas consequatur eum unde enim ad.",
    photo_url: "http://lorempixel.com/640/480/people"
    },
  distance: {
  // Returned from google represents the distance that driver is from our user.
        text: "99.4 km",
        value: 99357
    },
  duration: {
  // Returned from google represents the time it would take our driver to get to our user.
        text: "2 hours 26 mins",
        value: 8786 (seconds)
    },
     id: 4
    },
  {
    // driver 2
  }
  // etc.
}
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
  start_name: "street address (if available)",
  // string, produced by geocoding mother's location
  destination: "destination_here",
  // string, 500 char limit, must be findable by google maps API
  dest_name: "name of hospital sent when creating ride request",
  // string, if provided by request to create a ride
  ride_status: "complete"
  // string, indicates current status of ride ["waiting_on_driver", "Driver en route", "arrived_at_mother", "complete"]
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

| Method | URL                    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /api/users/onboard/:id | User ID expected in request URL. Request body should have shape: `{ user_type: "type", "type"Data: {type_data} }` in request body where `type` is `"mother"` or `"driver"` and `type_data` conforms to the appropriate [mother](##Mother-data) or [driver](##Driver-data) model. Creates a mother or driver with firebase_id matching `user`. Note: for `"caretaker"`, create a `"mother"` type entry with `"caretaker_name"` field supplied. |
| PUT    | /api/users/update/:id  | User ID expected in request URL. Include user, mother or driver data to be updated in request body, user/mother/driver will be updated according to request data. Request body should have shape: `{ user: { user-data }, mother/driver: { mother/driver-data } }`.                                                                                                                                                                           |

## Rides

| Method    | URL                                    | Description                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TODO-POST | /api/rides/drivers                     | Include `{ location: 'lat,lng' }` in request body. Returns [nearest driver data](###Nearest-driver-data) (ref. data schema above), returns an array of the nearest active drivers with a minimum of 5.                                                                                                                                                                                                       |
| POST      | /api/rides/request/driver/:firebase_id | The firebase*id should belong to the driver the mother selected. Include `{ end, start, distance, hospital, name, phone }` in request body. \_end='lat,lng' of hospital*, _start='lat,lng' of mother's location_, _hospital=name of hospital_, _name=name of mother_, _phone=phone number of mother_. Returns nothing. Will begin Twilio actions on the backend, mother and driver will be updated that way. |
| TODO-POST | /api/rides/new-ride                    | Include data as found in [new ride data](###New-ride-data) in request body. Creates a new ride and sends request to driver.                                                                                                                                                                                                                                                                                  |
| TODO-GET  | /api/rides/                            | Include `{ rideId: id }` in request body. Returns [complete ride data](###complete-ride-data).                                                                                                                                                                                                                                                                                                               |
| TODO-GET  | /api/rides/                            | Include `{ userId: id }` in request body. Returns **`array`** of [complete ride data](###complete-ride-data) matching `userId`.                                                                                                                                                                                                                                                                              |
| TODO-PUT  | /api/rides/                            | Include data in format of [complete ride data](###complete-ride-data), elements not included will not be updated. Updates ride data, returns ride data in format of [complete ride data](###complete-ride-data).                                                                                                                                                                                             |
| POST      | /api/rides/driver/rejects/:ride_id     | Include data object, inside body, given in push notification. Will gracefully handle rejection and notify next driver with price close to first driver.                                                                                                                                                                                                                                                      |
| GET       | /api/rides/driver/accepts/:ride_id     | Will notify mother, via twilio that the driver has accepted. Updates `ride_status` to `Driver en route`                                                                                                                                                                                                                                                                                                      |
| GET       | /api/rides/driver/arrives/:ride_id     | Will notify mother, via twilio that the driver has arrived. Updates `ride_status` to `arrived_at_mother`.                                                                                                                                                                                                                                                                                                    |
| GET       | /api/rides/driver/delivers/:ride_id    | Will notify mother, via twilio that the ride is complete. Updates `ride_status` to `complete`.                                                                                                                                                                                                                                                                                                               |

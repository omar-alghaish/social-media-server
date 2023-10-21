# Authentication and authorization system

This is an example of an API that uses an authentication and authorization system to challenge the user to validate credentials and check whether access is allowed by policies and rules

## Project structre:

```bash

│   config.env
│   index.js
│   package-lock.json
│   package.json
│   README.md
│
├───configs
│       database.js
│       dotenv.js
│       morgan.js
│       server.js
│
├───controllers
│       auth.controller.js
│       handlerFactory.js
│       user.controller.js
│
├───handlers
├───middlewares
│       error.Middleware.js
│       limiter.js
│       resizeImage.js
│       uploadImage.middlesare.js
│       validatorMiddleware.js
│
├───models
│       model.option.js
│       user.model.js
│
├───routes
│       auth.route.js
│       index.js
│       user.route.js
│
├───templates
│       restPassword.js
│
├───uploads
│   └───users
└───utils
    │   apiError.js
    │   apiFeatures.js
    │   sendEmail.js
    │
    └───validators
            authValidator.js
            userValidator.js
```

## Running

1-Clone repository.

2-install dependencies

```bash
npm install
```

3-run server

```bash
# for developmen
npm run start:dev

# for production
npm run start:prod
```

# Usage

## Admin endpoints

#### get users

#### REQUEST :

GET http:/127.0.0.1:8000/api/v1/users

#### RESPONSE :

```json
{
  "results": 3,
  "pagination": {
    "currentPage": 1,
    "limit": 20,
    "totalPages": 1
  },
  "data": [
    {
      "_id": "650f3caf4b1e715e5ee18c8",
      "name": "omar alghaish",
      "email": "omar@gmail.com",
      "profileImg": "http://localhost:8000/users/user-169575322700.jpeg",
      "password": "$2b$12$ltW9oyjeKf65aggOVtXRk.eGOLgiEERdhPFjAo0dfOLVBludvPJQe",
      "passwordResetVerified": false,
      "role": "admin",
      "active": true,
      "createdAt": "2023-09-23T19:29:51.345Z",
      "updatedAt": "2023-09-26T19:20:05.322Z",
      "__v": 0,
      "slug": "omar-alghaish5"
    },
    {
      "_id": "650f459f02344d837d1e1fc",
      "name": "omar alghaish",
      "email": "mark@gmail.com",
      "profileImg": "http://localhost:8000/users/user-1695499678887.jpeg",
      "password": "$2b$12$ltW9oyjeKf65aggOVtXRk.eGOLgiEERdhPFjAo0dfOLVBludvPJQe",
      "passwordResetVerified": false,
      "role": "user",
      "active": true,
      "createdAt": "2023-09-23T20:07:59.263Z",
      "updatedAt": "2023-09-23T20:07:59.263Z"
    }
  ]
}
```

### Create user

#### REQUEST :

POST http:/127.0.0.1:8000/api/v1/users/create

#### RESPONSE :

```json
{
  "data": {
    "name": "user3",
    "slug": "user3",
    "email": "user3@gmail.com",
    "phone": "0102234234",
    "password": "$2b$12$rPTZkhceq5giK2UKWxj9puZAPc.8j7e8x1aIZziHCWMSIDxbYaSES",
    "passwordResetVerified": false,
    "role": "user",
    "active": true,
    "_id": "6515e5689ecbbd4935eb90c",
    "createdAt": "2023-09-28T20:43:20.744Z",
    "updatedAt": "2023-09-28T20:43:20.744Z"
  }
}
```

### Update user

#### REQUEST :

PUT http:/127.0.0.1:8000/api/v1/users

#### RESPONSE :

```json
{
  "data": {
    "_id": "6515e5689ecbbd4935eb90c3",
    "name": "user3",
    "slug": "user3",
    "email": "user3@gmail.com",
    "phone": "01034343434",
    "password": "$2b$12$rPTZkhceq5giK2UKWxj9puZAPc.8j7e8x1aIZziHCWMSIDxbYaSES",
    "passwordResetVerified": false,
    "role": "admin",
    "active": true,
    "createdAt": "2023-09-28T20:43:20.744Z",
    "updatedAt": "2023-09-28T20:46:49.844Z"
  }
}
```

### Delete user

#### REQUEST :

DELETE http:/127.0.0.1:8000/api/v1/users

## Users endpoints

### signUp

#### REQUEST :

POST http:/127.0.0.1:8000/api/v1/signup

### sginIn

#### REQUEST :

POST http:/127.0.0.1:8000/api/v1/login

### get logged user data

#### REQUEST :

GET http:/127.0.0.1:8000/api/v1/users/me

### change password

#### REQUEST :

POST http:/127.0.0.1:8000/api/v1/users/changepassword/:id

### deactive user

#### REQUEST :

POST http:/127.0.0.1:8000/api/v1/users/me/deActive

### forget password

#### REQUEST :

POST http:/127.0.0.1:8000/api/v1/forgetpassword

### verify ResetCode

#### REQUEST :

POST http:/127.0.0.1:8000/api/v1/verifyResetCode

### reset Password

#### REQUEST :

PUT http:/127.0.0.1:8000/api/v1/resetPassword

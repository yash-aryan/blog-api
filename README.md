# Blog-api

## Overview

This is the backend Express server built on the REST architecture to serve API to the frontend. API allows users to authenticate themselves and perform CRUD actions with posts and comments on the post.

User details, posts, and comments are stored in a database using MongoDB on MongoDB Atlas service as cloud database.

## Features

- **RESTful Approach:** The server is stateless and follows REST architecture to ensure that the resources are well-organised and accessible. The resources are nested logically and can be retrieved or manipulated only through standard HTTP methods such as GET, POST, PUT, DELETE.
- **Security:** User's passwords are hashed and salted using bcrypt before being stored in the database for security reasons. The server also has a rate limit on requests.
- **Protected Routes:** Some resources are protected and requires the user to be authenticated. Authentication is performed through JWTs and using Passport.js library.

## Authentication

### User Registration

To register, send a POST request to `/auth/register` with request body containing the `username`, `email`, `password`. The password should contain at least 12 characters with 1 uppercase, 1 number, and 1 symbol.

```json
// request body
{
	"username": "Alice",
	"email": "alice@example.com",
	"password": "!strongpassword!"
}
```

Upon success, the server will send json response containing the signed JWT and user object. The JWT expires in 2 days, and requires login after token expiry.

```json
// response body
{
	"success": true,
	"message": "User registered!",
	"user": {
		"_id": <user id>,
		"name": "Alice",
		"email": "alice@example.com",
		"password": <hashed salted password>,
	},
	"token": <json web token>
}
```

### User Login

To login, send a POST request to `/auth/login` with request body containing the `email` and `password`. If the user credentials are correct, the response body will contain the new signed JWT.

```json
// response body
{
	"success": true,
	"message": "Auth Passed!",
	"token": <json web token>
}
```

### Accessing Protected Routes

To access protected routes, the request header needs to contain `Authorization` with the signed JWT appended to string 'Bearer '. The format **must** look like the following (containing the space between the text 'Bearer'):

```json
"Authorization": "Bearer <jsonwebtoken>"
```

## Posts

| Route              | Method | Action          |       Requirements |
| :----------------- | :----: | :-------------- | -----------------: |
| `/posts`           |  GET   | Get all posts   |                  - |
| `/posts`           |  POST  | Create new post | JWT & request body |
| `/posts/<post id>` |  PUT   | Update post     | JWT & request body |
| `/posts/<post id>` | DELETE | Delete post     |                JWT |

## Comments

| Route                                    | Method | Action                       |       Requirements |
| :--------------------------------------- | :----: | :--------------------------- | -----------------: |
| `/posts/comments`                        |  GET   | Get all comments on a post   |                  - |
| `/posts/comments`                        |  POST  | Create new comment on a post | JWT & request body |
| `/posts/<post id>/comments/<comment id>` |  PUT   | Update comment on a post     | JWT & request body |
| `/posts/<post id>/comments/<comment id>` | DELETE | Delete comment on a post     |                JWT |

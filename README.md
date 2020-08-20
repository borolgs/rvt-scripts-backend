# Revit Scripts Backend

![Tests](https://github.com/borolgs/rvt-scripts-backend/workflows/Tests/badge.svg)

Backend for [Scripts](https://www.notion.so/olbo/Scripts-15f253b8684b4f3495c56f7b571f6db1).
Wrapper around Github's API.

## Live Demo

https://rvt-scripts.herokuapp.com

### API

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/22593136d6ff4d0a0a2a)

#### POST Sign Up

`https://rvt-scripts.herokuapp.com/auth/signup`

```http
POST /auth/signup HTTP/1.1
Host: https://rvt-scripts.herokuapp.com
Content-Type: application/json

{
    "email": "user@mail.com",
    "password": "password",
    "name": "Ivan"
}
```

#### POST Log In

`https://rvt-scripts.herokuapp.com/auth/login`

```http
POST /auth/login HTTP/1.1
Host: https://rvt-scripts.herokuapp.com
Content-Type: application/json

{
    "email": "user@mail.com",
    "password": "password"
}
```

#### Get Scripts

`https://rvt-scripts.herokuapp.com/api/v1/scripts`

```http
GET /api/v1/scripts HTTP/1.1
Host: https://rvt-scripts.herokuapp.com
Scripts-Sha: <COMMIT_HASH>
Authorization: Bearer <TOKEN>
```

#### Get Users

Admin only

`https://rvt-scripts.herokuapp.com/api/v1/users`

```http
GET /api/v1/scripts HTTP/1.1
Host: https://rvt-scripts.herokuapp.com
Authorization: Bearer <TOKEN>
```

## Usage

1. Create .env file

   ```
   MONGO_URI=your/mongo/path
   GUTHUB_TOKEN=github_token
   GITHUB_USERNAME=github_user
   GITHUB_REPO=github_repo
   JWT_SECRET=secret
   ```

2. Look at the ./src/domains/entities/code.entity.ts and modify to suit your needs.
3. Run
   ```
   npm i
   npm run start:dev
   ```
   or
   ```
   docker-compose up
   ```

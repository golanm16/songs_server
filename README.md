# songs server

# technologies used:

[סיכום עברית](./summary_he.md)

## dotenv

we learned to dotenv library in nodejs

```
npm i dotenv
```

make a file called ".env" in the main folder, and add the file to .gitignore

```
.env
```

in our main file (server.js) import the dotenv,
and directly call the config function of the module

```js
require("dotenv").config();
```

and after that every file in our server can access the env variables like so:

```js
process.env.MY_VAR;
```

### notes:

- no " or ; in the .env file
- need to call config() only once

## Router

to split the files for every route, we need to use the built-in Router of express
likes this in the [file](./routes/songs.js) of your route (ex.:"./routes/songs.js"):

```js
// get the router from express
const router = express.Router();

// define your diferrent routes
router.get("/songs2", async (req, res) => {
  console.log("songs 2");
  res.send("songs 2");
});

// export the router
module.exports = router;
```

then have a main router [file](./routes/router.js) that imports all the routes and exports them

```js
// import all relevant routes
const songsRoute = require("./songs");
const usersRoute = require("./users");

// export them in a single object
module.exports = { songsRoute, usersRoute };
```

in the main server [file](./server.js) import all the routes from the router [file](./routes/router.js)
and in the code tell express to use those routes

```js
// import routes
const { songsRoute, usersRoute } = require("./routes/router.js");

// define routes for express
app.use("/songs", songsRoute);
app.use("/users", usersRoute);
```

and the every request that our server gets and have /songs/something, gets handled by the [songs.js](./routes/songs.js) file

## Hashing using bcypt

to secure our users' password we don't want to store the password as a simple text.<br>
we want to [hash](https://en.wikipedia.org/wiki/Hash_function) the password.<br>

an easy tool for nodejs is bcrypt. first install bcrypt.

```
npm i bcrypt
```

### hash

and then lets see an example of how to use it.
in my code it can be found in [this file](./routes/users.js)

```js
// import bcrypt
const bcrypt = require("bcrypt");

// remember: must be in an async function
const hashedPassword = await bcrypt.hash(password, 10);
```

and the hashedPassword is stored in our database and not the real password

### compare

```js
// must be in an async function
const match = await bcrypt.compare(password, hashedPassword);
```

and then match=true if the password the user gave me matches the hashed password in our database

const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

/* Controllers */
const signup = require("./controllers/signup");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

/* Database */
const database = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "postgres",
		password: "db",
		database: "'FaceBox'"
	}
});

/* App and Middleware */
const app = express();
app.use(bodyParser.json());
app.use(cors());

/* Endpoints */
app.get("/", (req, res) => {
	res.json('it works');
});
app.post("/signin", signin.handleSignin(database, bcrypt));
app.post("/signup", signup.handleSignup(database, bcrypt));
app.post("/profile/:id", profile.handleProfile(database));
app.put("/image", image.handleImage(database));
app.post("/imageurl", image.handleAPICall);

/* Port */
app.listen(process.env.PORT || 3000, () =>
	console.log(`app is running on port ${process.env.PORT}`)
);

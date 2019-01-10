const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

/* Controllers */
const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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
	res.json(database.users);
});
app.post("/signin", (req, res) => signin.handleSignin(req, res, database, bcrypt));
app.post("/signup", (req, res) => signup.handleSignup(req, res, database, bcrypt));
app.post("/profile/:id", (req, res) => profile.handleProfile(req, res, database));
app.put("/image", (req, res) => image.handleImage(req, res, database));

/* Port */
app.listen(3000, () => console.log("app is running on port 3000"));
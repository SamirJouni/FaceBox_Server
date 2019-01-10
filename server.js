const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const signup = require('./controllers/signup');
const signin = require('./controllers/signin');

const database = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "postgres",
		password: "db",
		database: "'FaceBox'"
	}
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
	res.json(database.users);
});
app.post("/signin", (req, res) => signin.handleSignin(req, res, database, bcrypt));
app.post("/signup", (req, res) => signup.handleSignup(req, res, database, bcrypt));
app.post("/profile/:id", (req, res) => {
	const { id } = req.params;
	database
		.select("*")
		.from("users")
		.where({ id })
		.then(user => {
			if (user.length) {
				res.json(user[0]);
			} else {
				throw "";
			}
		})
		.catch(err => res.status(404).json("user not found!"));
});
app.put("/image", (req, res) => {
	const { id } = req.body;
	database("users")
		.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
		.then(entries => {
			if (entries.length) {
				res.json(entries[0]);
			} else {
				throw "";
			}
		})
		.catch(err => res.status(404).json("user not found!"));
});

app.listen(3000, () => console.log("app is running on port 3000"));

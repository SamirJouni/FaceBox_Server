const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

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

const database1 = {
	users: [
		{
			id: "123",
			name: "john",
			email: "john@mail.com",
			password: "nopassword",
			entries: 0,
			joined: new Date()
		},
		{
			id: "321",
			name: "sally",
			email: "sally@mail.com",
			password: "thisissecret",
			entries: 0,
			joined: new Date()
		}
	]
};
app.get("/", (req, res) => {
	res.json(database.users);
});
app.post("/signin", (req, res) => {
	if (
		req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password
	) {
		res.json(database.users[0]);
	} else {
		res.status(400).json("wrong email or password");
	}
});
app.post("/signup", (req, res) => {
	const { name, email, password } = req.body;
	database("users")
		.returning("*")
		.insert({
			email,
			name,
			joined: new Date()
		})
		.then(ret => res.json(ret[0]))
		.catch(err =>
			res
				.status(400)
				.json(
					"Something went wrong! Make sure to use a unique username and email."
				)
		);
});
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
	database('users')
		.where("id", "=", id)
		.increment("entries", 1)
		.returning("entries")
		.then(entries => console.log(entries));
	res.status(404).json("user not found!");
});

app.listen(3000, () => console.log("app is running on port 3000"));

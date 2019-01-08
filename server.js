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

app.get("/", (req, res) => {
	res.json(database.users);
});
app.post("/signin", (req, res) => {
	database
		.select("email", "hash")
		.from("login")
		.where("email", "=", req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return database
					.select("*")
					.from("users")
					.where("email", "=", req.body.email)
					.then(data => res.json(data[0]))
					.catch(err => res.status(400).json("Wrong email or password."));
			} else {
				res.status(400).json("Wrong email or password.");
			}
		})
		.catch(err => res.status(400).json("Wrong email or password."));
});
app.post("/signup", (req, res) => {
	const { name, email, password } = req.body;
	const hash = bcrypt.hashSync(password);
	database
		.transaction(trx => {
			trx
				.insert({
					hash: hash,
					email: email
				})
				.into("login")
				.returning("email")
				.then(signupEmail => {
					return trx("users")
						.returning("*")
						.insert({
							email: signupEmail[0],
							name: name,
							joined: new Date()
						})
						.then(user => {
							res.json(user[0]);
						});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		})
		.catch(err =>
			res.status(400).json("Something went wrong! Please try again.")
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

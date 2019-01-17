const handleSignin = (database, bcrypt) => (req, res) => {
	const {
		email,
		password
	} = req.body;
	if (email || password) {
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
	} else {
		res.status(400).json("Something went wrong! Please try again.")
	}
}


module.exports = {
	handleSignin: handleSignin
}
const handleSignup = (database, bcrypt) => (req, res) => {
	const {
		name,
		email,
		password
	} = req.body;
	if (name || email || password) {
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
	} else {
		res.status(400).json("Something went wrong! Please try again.")
	}
}

module.exports = {
	handleSignup: handleSignup
}
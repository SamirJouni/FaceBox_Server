const handleProfile = (req, res, database) => {
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
}

module.exports = {
	handleProfile: handleProfile
}
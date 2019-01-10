const handleImage = (database) =>  (req, res) => {
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
}

module.exports = {
	handleImage: handleImage
}
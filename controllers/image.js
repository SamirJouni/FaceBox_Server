const Clarifai = require('clarifai');

const app = new Clarifai.App({
	apiKey: "ae065545ab8b471193bc116abcab07b2"
});

const handleAPICall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.linkToImage)
		.then(data => res.json(data))
		.catch(err => res.status(400).json('Failed to connect to API'))
}
const handleImage = (database) => (req, res) => {
	const {
		id
	} = req.body;
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
	handleImage: handleImage,
	handleAPICall: handleAPICall
}
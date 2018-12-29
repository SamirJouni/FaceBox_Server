const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'john',
			email: 'john@mail.com',
			password: 'nopassword',
			entries: 0,
			joined: new Date()
		},
		{
			id: '321',
			name: 'sally',
			email: 'sally@mail.com',
			password: 'thisissecret',
			entries: 0,
			joined: new Date()
		},

	]
}
app.get('/', (req, res) => {
	res.json(database.users)
});
app.post('/signin', (req, res) => {
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('wrong email or password')
	}
});
app.post('/signup', (req, res) => {
	const { name, email, password } = req.body;
	database.users.push({
		id: '543',
		name,
		email,
		password,
		entries: 0,
		joined: new Date()
	});
	res.json(database.users[database.users.length - 1]);
});
app.post('/profile/:id', (req, res) => {
	const { id } = req.params;
	database.users.forEach(
		user => {
			if(user.id === id) {
				return res.json(user);
			}
		}
		);
		res.status(404).json('user not found!');
});
app.put('/image', (req, res) => {
	const { id } = req.body;
	database.users.forEach(
		user => {
			if(user.id === id) {
				user.entries++
				return res.json(user.entries);
			}
		}
		);
		res.status(404).json('user not found!');
});

app.listen(3000, () => console.log('app is running on port 3000'));
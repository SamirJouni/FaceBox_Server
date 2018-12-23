const express = require('express');

const app = express();

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
	res.json('this is working !')
});
app.get('/signin', (req, res) => {
	res.json('Signed in !')
});

app.listen(3000, () => console.log('app is running on port 3000'));
const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.json('this is working !')
});
app.get('/signin', (req, res) => {
	res.json('Signed in !')
});

app.listen(3000, () => console.log('app is running on port 3000'));
const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../login.html'));
});



router.post('/', (req, res) => {
	var password = req.body.password;
	console.log('innslegið lykilorð var: '+password);
	res.redirect('/'+password);
});

router.get('/12345', (req, res) => {
	res.sendFile(path.join(__dirname, '../mongotest.html'));
});

router.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../adgangur_oheimill.html'));
});



module.exports = router
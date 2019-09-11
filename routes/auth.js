const router = require('express').Router();
const User = require('../models/Users');

router.post('/register', (req, res, next) => {
	User.create({ ...req.body })
		.then((user) => {
			res.json(user);
		})
		.catch((err) => {
			res.status(400).json('Error: ' + err);
		});
});

module.exports = router;

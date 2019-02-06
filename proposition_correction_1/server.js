'use strict';

const
express = require('express'),
bodyParser = require('body-parser');

const app = express();

app.use((req, res, next) => {
	console.log(req.method + ' : ' + req.url);
	next();
});

app.use(bodyParser.json()); // => req.body

const personCtrl = require('./person_ctrl');
const mailAddressCtrl = require('./mail_address_ctrl');

// register Person routes
app.get('/person', personCtrl.get_all);
app.post('/person', personCtrl.create);
app.get('/person/:person_id', personCtrl.get_by_id);
app.put('/person/:person_id', personCtrl.update_by_id);
app.delete('/person/:person_id', personCtrl.delete_by_id);

// register MailAddress routes


// register error handling middleware
app.use((err, req, res, next) => {
	if (err.status === undefined) {
		return res.status(500).send(err.message);
	} else {
		return res.status(err.status).send(err.message);
	}
});

// launch server
const server = app.listen(3000, () => {
	const host = server.address().address;
	const port = server.address().port;
	console.log('App listening at http://%s:%s', host, port);
});

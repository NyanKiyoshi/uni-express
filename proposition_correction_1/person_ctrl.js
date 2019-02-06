const db = require('./db');

module.exports = {
	
	get_all: (req, res, next) => {
		return db.Person.findAll()
		.then((persons) => res.json(persons))
		.catch((err) => next(err));
	},

	create: (req, res, next) => {
		const data = {
			firstname: req.body.firstname || '',
			lastname: req.body.lastname || ''
		};
		return db.Person.create(data)
		.then((person) => res.json(person))
		.catch((err) => next(err));
	},

	get_by_id: (req, res, next) => {
		return db.Person.findById(req.params.person_id)
		.then((p) => {
			if (!p) {
				throw {
					status: 404,
					message: 'Person not found'
				};
			}
			return res.json(p);
		})
		.catch((err) => next(err));
	},

	update_by_id: (req, res, next) => {
		return db.Person.findById(req.params.person_id)
		.then((p) => {
			if (!p) {
				throw {
					status: 404,
					message: 'Person not found'
				};
			}
			return p.update(req.body);
		})
		.then((p) => res.json(p))
		.catch((err) => next(err));
	},

	delete_by_id: (req, res, next) => {
		return db.Person.findById(req.params.person_id)
		.then((p) => {
			if (!p) {
				throw {
					status: 404,
					message: 'Person not found'
				};
			}
			return p.destroy();
		})
		.then(() => res.status(200).end())
		.catch((err) => next(err));
	}

};
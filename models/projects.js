import db from '../lib/db'

export default {
	getProjectsInfo (callback) {
		let q = 'SELECT * FROM projects';
		db.executeQuery(q, [], (err, data) => {
			callback(data);
		});
	}
}
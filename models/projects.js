import db from '../lib/db'

export default {
	getProjectsInfo (callback) {
		let q = 'SELECT * FROM projects';
		db.executeQuery(q, [], (err, data) => {
			callback(err, data);
		});
	},
	getProjectsParams (hot, callback) {
        let q = 'SELECT * FROM projects_params WHERE hot = ' + hot;
        db.executeQuery(q, [], (err, data) => {
			callback(err, data);
		});
	},
	addProject (data, callback) {
		let q = 'INSERT INTO projects(project_name, area, position, type, begin_time) VALUES ($1, $2, $3, $4, $5)';
		let params = [data.projectName, data.area, data.position, data.type, data.beginTime];
		db.executeQuery(q, params, (err, data) => {
			if (err) {
				callback(err);
				return;
			}
			db.executeQuery('select max(id) from projects',[], (err, data) => {
				callback(err, data[0].max);
			});
		});
	},
	addProjectAveData (data, callback) {
		let q = 'INSERT INTO projects_params(tui, tuo, tgi, tgo, gu, gg, pl, pu, pg, hot, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)'
		let params = [data.tui, data.tuo, data.tgi, data.tgo, data.gu, data.gg, data.pl, data.pu, data.pg, data.hot, data.projectId];
		db.executeQuery(q, params, (err, data) => {
			callback(err, data);
		})
	}
}
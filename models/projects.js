import db from '../lib/db'

export default {
	getProjectsInfo () {
		let q = 'SELECT * FROM projects';
		return db.executeQuery(q, []);
	},
	getProjectsParams (hot, callback) {
        let q = 'SELECT * FROM projects_params WHERE hot = ' + hot;
        return db.executeQuery(q, []);
	},
	async addProject (data) {
		let q = 'INSERT INTO projects(project_name, area, position, type, begin_time) VALUES ($1, $2, $3, $4, $5)';
		let params = [data.projectName, data.area, data.position, data.type, data.beginTime];
		await db.executeQuery(q, params);
		return db.executeQuery('select max(id) from projects',[]);
	},
	saveProjectAveData (data) {
		let q = 'INSERT INTO projects_params(tui, tuo, tgi, tgo, gu, gg, pl, pu, pg, hot, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)'
		let params = [data.tui, data.tuo, data.tgi, data.tgo, data.gu, data.gg, data.pl, data.pu, data.pg, data.hot, data.project_id];
		return db.executeQuery(q, params)
	},
	getProjectAveData(hot, project_id) {
		let q = `SELECT * FROM projects_params WHERE hot = ${hot} AND project_id = ${project_id}`;
		console.log(q);
		return db.executeQuery(q, []);
	},
	updateProjectAveData(data, id) {
		return db.updateFields('projects_params', 'id', id, data);
	}
}
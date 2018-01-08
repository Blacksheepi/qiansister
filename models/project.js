import db from '../lib/db'


export default {
	saveProjectParams (data, projectId, year, hot) {
        
    
		let unionStr = ''
		for (let i=0;i<data.tui.length;i++) {
            unionStr += ` select ${data.tui[i]}, ${data.tuo[i]}, ${data.tgi[i]}, ${data.tgo[i]}, ${data.gu[i]}, ${data.gg[i]}, ${data.pl[i]}, ${data.pu[i]}, ${data.pg[i]}, ${projectId}, '${year}', ${hot} union all`
		}
		if (data) {
			unionStr = unionStr.slice(0, -9);
		}
		let q = 'INSERT INTO project_params(tui, tuo, tgi, tgo, gu, gg, pl, pu, pg, project_id, time, hot) ';
		q += unionStr;

		return db.executeQuery(q, []);
	},
	updateProjectInfo (projectInfo, id) {
        return db.updateFields('projects', 'id', id, projectInfo);
	},
	getProjectParams (id) {

		let q1 = `SELECT * FROM project_params WHERE project_id = '${id}'`;
		let res = {};
		return db.executeQuery(q1, []);
	},
	getProjectInfo (id) {
		let q = 'SELECT * FROM projects WHERE id = ' + id;
		return db.executeQuery(q, []);
	}
}

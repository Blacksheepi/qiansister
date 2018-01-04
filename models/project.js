import db from '../lib/db'


export default {
	createProject (data, projectId, year, hot, callback) {
        
    
		let unionStr = ''
		for (let i=0;i<data.tui.length;i++) {
            unionStr += ` select ${data.tui[i]}, ${data.tuo[i]}, ${data.tgi[i]}, ${data.tgo[i]}, ${data.gu[i]}, ${data.gg[i]}, ${data.pl[i]}, ${data.pu[i]}, ${data.pg[i]}, ${projectId}, '${year}', ${hot} union all`
		}
		if (data) {
			unionStr = unionStr.slice(0, -9);
		}
		let q = 'INSERT INTO project_params(tui, tuo, tgi, tgo, gu, gg, pl, pu, pg, project_id, time, hot) ';
		q += unionStr;
		console.log(q);

		db.executeQuery(q, [], (err, data) => {
			callback(err, data);
		});
	},
	viewProject (id, callback) {

		let q1 = `SELECT * FROM project_params WHERE project_id = '${id}'`;
		let res = {};
		db.executeQuery(q1, [], (err, data) => {
			if (err) {
				callback(err);
			}
			let projectDetail = data;
			let q2 = `SELECT * FROM projects WHERE id = '${id}'`;
		    db.executeQuery(q2, [], (err, data) => {
		    	let projectInfo = data;
		    	res.projectInfo = projectInfo;
		    	res.projectDetail = projectDetail;
		    	console.log('model res', res);
			    callback(err, res);
		    });
		});
	},
	getProjectInfo (id, callback) {
		let q = 'SELECT * FROM projects WHERE id = ' + id;
		db.executeQuery(q, [], (err, data) => {
			if (data) {
				callback(err, data[0]);
			} else {
				err = {
					msg: '请求的项目不存在！'
				};
			}
		});
	}
}

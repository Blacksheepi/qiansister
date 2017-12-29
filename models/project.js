import db from '../lib/db'


export default {
	createProject (table, projectName, projectDescribe, callback) {
        
        //存入project_detail表参数信息
		let items = dataFormat(table, projectName);
		let unionStr = ''
		for (let item of items) {
            unionStr += ` select '${item.project_name}', '${item.time}', ${item.tgo}, ${item.tg}, ${item.a}, ${item.n}, ${item.cop}, ${item.eer} union all`
		}
		if (items && items.length > 0) {
			unionStr = unionStr.slice(0, -9);
		}
		let q = 'INSERT INTO project_detail(project_name, time, tgo, tg, a, n, cop, eer) ';
		q += unionStr;

		//存入projects表项目信息
		for ()
		let q1 = 'INSERT INTO projects(project_name, area, position, type, tgo, tg, a, n, cop, eer, res) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';

		db.executeQuery(q, [], (err, data) => {
			if (err) {
				callback(err);
				return;
			}
			db.executeQuery(q1, [projectDescribe.project_name, projectDescribe.area, projectDescribe.position, projectDescribe.type, projectDescribe.tgo, projectDescribe.tg, projectDescribe.a, projectDescribe.n,
			    projectDescribe.cop, projectDescribe.eer, projectDescribe.res], (err, data) => {
			    callback(err, data);
		    });
		});
	},
	viewProject (projectName, callback) {
		let q1 = `SELECT * FROM project_detail WHERE project_name = '${projectName}'`;
		let res = {};
		db.executeQuery(q1, [], (err, data) => {
			if (err) {
				callback(err);
			}
			let projectDetail = data;
			let q2 = `SELECT * FROM projects WHERE project_name = '${projectName}'`;
		    db.executeQuery(q2, [], (err, data) => {
		    	let projectInfo = data;
		    	res.projectInfo = projectInfo;
		    	res.projectDetail = projectDetail;
		    	console.log('model res', res);
			    callback(err, res);
		    });
		});
	}
}

function dataFormat(table, projectName) {
    let columnName = table[0];
    let res = [];
    for (let i=1;i<table.length;i++) {
    	let item = {};
    	for (let j=0;j<columnName.length;j++) {
    		item[columnName[j]] = table[i][j];
    	}
    	item.project_name = projectName;
    	res.push(item);
    }
    return res;
}
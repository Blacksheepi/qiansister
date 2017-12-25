import db from '../lib/db'


export default {
	createProject (table,projectName, callback) {

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
		db.executeQuery(q, [], (err, data) => {
			callback(err, data);
		});
	},
	viewProject (projectName, callback) {
		let q1 = `SELECT * FROM project_detail WHERE project_name = '${projectName}'`;
		db.executeQuery(q1, [], (err, data) => {
			if (err) {
				callback(err);
			}
			let projectDetail = data;
			let q2 = `SELECT * FROM projects WHERE project_name = '${projectName}'`;
		    db.executeQuery(q2, [], (err, data) => {
		    	let projectInfo = data;
		    	let res = {
		    		projectDetail,
		    		projectInfo
		    	}
		    	console.log('model res', res);
			    callback(err, data);
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
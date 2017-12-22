import db from '../lib/db'


export default {
	createProject (table,projectName, callback) {
		let items = dataFormat(table, projectName);
		let unionStr = ''
		for (let item of items) {
            unionStr += `select ${item.project_name}, ${time}, ${item.tgo}, ${item.tg}, ${item.a}, ${item.n}, ${item.cop}, ${item.eer} union all`
		}
		if (items && items.length > 0) {
			unionStr = unionStr.slice(0, -9);
		}
		let q = 'INSERT INTO project_detail(project_name, time, tgo, tg, a, n, cop, eer) ';
		q += unionStr;
		console.log(q);
		db.executeQuery(q, [], (err, data) => {
			console.log('err', err);
			console.log('data', data);
			callback(data);
		});
	}
}

function dataFormat(table, projectName) {
	console.log(table);
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
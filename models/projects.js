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
	},
	addProject (projectInfo, aveData, projectParams, year, hot) {
		return new Promise(async (resolve, reject) => {
			let id;
		    let insertFunc = (dbClient, projectInfo, aveData, projectParams, year, hot) => {

		        return new Promise (async (resolve, reject) => {
		        	try {
		        		console.log('projectInfo', projectInfo)
		        	    let q = 'INSERT INTO projects(project_name, area, position, type, begin_time) VALUES ($1, $2, $3, $4, $5) RETURNING id';
        			    let params = [projectInfo.projectName, projectInfo.area, projectInfo.position, projectInfo.type, projectInfo.beginTime];
            			let res = await dbClient.query(q, params);
            			console.log('project info add success!');
            			id = res.rows[0].id;      

            			//save params average data to table projects_params 
            			let q1 = 'INSERT INTO projects_params(tui, tuo, tgi, tgo, gu, gg, pl, pu, pg, hot, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
            			let params1 = [aveData.tui, aveData.tuo, aveData.tgi, aveData.tgo, aveData.gu, aveData.gg, aveData.pl, aveData.pu, aveData.pg, aveData.hot, id];
            			await dbClient.query(q1, params1); 
            			console.log('project average data add success!');     

            			//save project params to table project_params
            			let unionStr = ''
            		    for (let i=0;i<projectParams.tui.length;i++) {
                            unionStr += ` select ${projectParams.tui[i]}, ${projectParams.tuo[i]}, ${projectParams.tgi[i]}, ${projectParams.tgo[i]}, ${projectParams.gu[i]}, ${projectParams.gg[i]}, ${projectParams.pl[i]}, ${projectParams.pu[i]}, ${projectParams.pg[i]}, ${id}, '${year}', ${hot} union all`
                		}
                		if (projectParams) {
                			unionStr = unionStr.slice(0, -9);
                		}
                		let q2 = 'INSERT INTO project_params(tui, tuo, tgi, tgo, gu, gg, pl, pu, pg, project_id, time, hot) ';
                		q2 += unionStr;
                		await dbClient.query(q2, []);
                		console.log('project params add success!');
                		resolve();
		        	} catch (e) {
		        		reject(e);
		        	}
		        }); 
    		}
    		try {
    			await db.transactions(insertFunc, [projectInfo, aveData, projectParams, year, hot]);
			    resolve(id)
    		} catch (e) {    
                reject('addProject err');
                throw err;
    		}
		})
	},
	updateProject (projectInfo, aveData, projectParams, year, hot, id, hasAveData) {

		return new Promise(async (resolve, reject) => {

		    let insertFunc = (dbClient, projectInfo, aveData, projectParams, year, hot, id, hasAveData) => {

		    	let updateFields = (tableName, idColumnName, idValue, fields) => {
	                let fieldArr = [];
                	let params = [];
                	let counter = 1;                

                	for (let field in fields) {
                		if (field == idColumnName) {
                			continue;
                		}
                		fieldArr.push(`${field}=$${counter}`);
                		params.push(fields[field]);
                		counter++;
                	}
                	params.push(idValue);                

                	let updateStr = fieldArr.join(', ');
                	let queryStr = `UPDATE ${tableName} SET ${updateStr} WHERE ${idColumnName} = $${counter};`;
                	return dbClient.query(queryStr, params);
                }

		        return new Promise (async (resolve, reject) => {

		        	try {
		        		await updateFields('projects', 'id', id, projectInfo);
                        console.log('project info update success!');
            			//save params average data to table projects_params
            			if (hasAveData) {
            				await updateFields('projects_params', 'id', aveData.id, aveData);
            			} else {
            				let q1 = 'INSERT INTO projects_params(tui, tuo, tgi, tgo, gu, gg, pl, pu, pg, hot, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)';
            			    let params1 = [aveData.tui, aveData.tuo, aveData.tgi, aveData.tgo, aveData.gu, aveData.gg, aveData.pl, aveData.pu, aveData.pg, aveData.hot, id];
            			    await dbClient.query(q1, params1); 
            			} 
            			console.log('project average data update success!');   

            			//save project params to table project_params
            			let unionStr = ''
            		    for (let i=0;i<projectParams.tui.length;i++) {
                            unionStr += ` select ${projectParams.tui[i]}, ${projectParams.tuo[i]}, ${projectParams.tgi[i]}, ${projectParams.tgo[i]}, ${projectParams.gu[i]}, ${projectParams.gg[i]}, ${projectParams.pl[i]}, ${projectParams.pu[i]}, ${projectParams.pg[i]}, ${id}, '${year}', ${hot} union all`
                		}
                		if (projectParams) {
                			unionStr = unionStr.slice(0, -9);
                		}
                		let q2 = 'INSERT INTO project_params(tui, tuo, tgi, tgo, gu, gg, pl, pu, pg, project_id, time, hot) ';
                		q2 += unionStr;
                		console.log(q2)
                		await dbClient.query(q2, []);
                		console.log('project params update success!');
                		resolve();
		        	} catch (e) {
		        		reject(e);
		        	}
		        }); 
    		}
    		try {
    			await db.transactions(insertFunc, [projectInfo, aveData, projectParams, year, hot, id, hasAveData]);
			    resolve(id)
    		} catch (e) {    
                reject('updateProject err');
                throw err;
    		}
		})
	}
}
/**
 * Created by haoqianhuang on 2018/3/22.
 */

import db from '../lib/db'

export default {
    /*左边导航获取project 列表*/
    getProjectsInfo () {
        let q = 'SELECT * FROM data_project';
        return db.executeQuery(q, []);
    },

    getProjectById (id) {
        let q = 'SELECT * FROM data_project WHERE id = ' + id;
        return db.executeQuery(q, []);
    },

    getProjectsParamsByIdAndYear (id, year, callback) {
        let q = "SELECT * FROM data_project_params WHERE project_id = " + id + " And year = '" + year + "'";
        console.log(q);
        return db.executeQuery(q, []);
    },

    deleteProject (id) {
        let q = 'DELETE FROM data_project WHERE id = ' + id;
        return db.executeQuery(q, []);
    },

    /*没有上传附件的时候调用*/
    addProjectInfo (projectInfo) {
        let q = 'INSERT INTO projects(name) VALUES ($1) RETURNING id';
        let params = [projectInfo.name];
        return new Promise(async (resolve, reject) => {
            try {
                let res = await db.executeQuery(q, params);
                console.log('res', res);
                let id = res[0].id
                console.log('project info add success!');
                console.log('id', id);
                resolve(id);
            } catch (e) {
                console.log('project info add failed!');
                reject(e);
            }
        })
    },

    //isAddedInfo 已经上传过文件
    //hot:true为暖季
    addProject (projectInfo, projectParams, year, hot, isAddedInfo, id) {
        return new Promise(async (resolve, reject) => {
            if (!id) {
                let id;
            }

            let insertFunc = (dbClient, projectInfo, projectParams, year, hot) => {

                return new Promise(async (resolve, reject) => {
                    try {
                        console.log('projectInfo', projectInfo)

                        if (isAddedInfo) {  //when add cold file and hot file both, project info only need add once

                        } else {//往project表中插入数据
                            let q = 'INSERT INTO data_project(name) VALUES ($1) RETURNING id';
                            let params = [projectInfo.name];
                            let res = await dbClient.query(q, params);
                            console.log('project info add success!');
                            id = res.rows[0].id;
                        }

                        //save project params to table project_params
                        //INSERT INTO data_project_params(time, tui, tuo, tgi, tgo, gu, gg,  project_id, year, hot)  values (2018/1/1 00:00, 3, 2) (2018/1/1 01:00, 6, 5 )
                        let unionStr = ''
                        for (let i = 0; i < projectParams.time.length; i++) {
                            unionStr += ` select '${projectInfo.name}', '${projectParams.time[i]}', ${projectParams.tui[i]}, ${projectParams.tuo[i]},${projectParams.tgi[i]}, ${projectParams.tgo[i]}, ${projectParams.gu[i]}, ${projectParams.gg[i]},  ${id}, '${year}', ${hot} union all`
                        }
                        if (projectParams) {
                            unionStr = unionStr.slice(0, -9);
                        }
                        console.log(unionStr);
                        let q2 = 'INSERT INTO data_project_params(name, time, tui, tuo, tgi, tgo, gu, gg,  project_id, year, hot) ';
                        q2 += unionStr;
                        console.log(q2);
                        await dbClient.query(q2, []);
                        console.log('project params add success!');
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                });
            }

            try {
                await db.transactions(insertFunc, [projectInfo, projectParams, year, hot]);
                resolve(id)
            } catch (e) {
                reject('addProject err');
                throw err;
            }
        })
    },

    updateProject (projectInfo, projectParams, year, hot, id) {
        return new Promise(async (resolve, reject) => {
            let insertFunc = (dbClient, projectInfo, projectParams, year, hot, id) => {

                /* let updateFields = (tableName) => {
                 let fieldArr = [];
                 let params = [];
                 let counter = 1;

                 for (let field in projectInfo) {
                 if (field === 'id') {
                 continue;
                 }
                 fieldArr.push(`${field}=$${counter}`);
                 params.push(projectInfo[field]);
                 counter++;
                 }
                 params.push(id);

                 let updateStr = fieldArr.join(', ');
                 let queryStr = `UPDATE ${tableName} SET ${updateStr} WHERE ${id} = $${counter};`;
                 console.log(queryStr);
                 return dbClient.query(queryStr, params);
                 };*/

                return new Promise(async (resolve, reject) => {

                    try {
                        await db.updateFields('data_project', 'id', id, projectInfo);
                        console.log('project info update success!');

                        let q1 = "UPDATE data_project_params SET name='" + projectInfo.name + "' WHERE project_id =" + id;
                        console.log('UPDATE data_project_params namenamenamename', q1);
                        await dbClient.query(q1, []);
                        console.log('data_project_params update success!');

                        //save project params to table project_params
                        let unionStr = '';
                        for (let i = 0; i < projectParams.time.length; i++) {
                            unionStr += ` select '${projectInfo.name}', '${projectParams.time[i]}', ${projectParams.tui[i]}, ${projectParams.tuo[i]}, ${projectParams.tgi[i]}, ${projectParams.tgo[i]}, ${projectParams.gu[i]}, ${projectParams.gg[i]}, ${id}, '${year}', ${hot} union all`
                        }
                        if (projectParams) {
                            unionStr = unionStr.slice(0, -9);
                        }
                        let q2 = 'INSERT INTO data_project_params(name, time, tui, tuo, tgi, tgo, gu, gg,  project_id, year, hot) ';
                        q2 += unionStr;
                        console.log(q2);
                        await dbClient.query(q2, []);
                        console.log('data project params insert success!');
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                });
            }
            try {
                await db.transactions(insertFunc, [projectInfo, projectParams, year, hot, id]);
                resolve(id)
            } catch (e) {
                reject('updateProject err');
                throw err;
            }
        })
    },

    updateProjectInfo (projectInfo, id) {
        return new Promise(async (resolve, reject) => {
            let insertFunc = (dbClient, projectInfo, id) => {
                return new Promise(async (resolve, reject) => {

                    try {
                        await db.updateFields('data_project', 'id', id, projectInfo);
                        console.log('project info update success!');

                        let q1 = "UPDATE data_project_params SET name='" + projectInfo.name + "' WHERE project_id =" + id;
                        console.log('UPDATE data_project_params namenamenamename', q1);
                        await dbClient.query(q1, []);
                        console.log('data_project_params update success!');
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                });
            };
            try {
                await db.transactions(insertFunc, [projectInfo, id]);
                resolve(id)
            } catch (e) {
                reject('updateProject err');
                throw err;
            }
        })
    }


    /*getProjectParams (id) {
     let q1 = `SELECT * FROM data_project_params WHERE project_id = '${id}'`;
     return db.executeQuery(q1, []);
     },

     saveProjectAveData (data) {
     let q = 'INSERT INTO projects_params(p, p2, tui, tuo, tgi, tgo, gu, gg, pl, pu, pg, hot, project_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)'
     let params = [data.p, data.p2, data.tui, data.tuo, data.tgi, data.tgo, data.gu, data.gg, data.pl, data.pu, data.pg, data.hot, data.project_id];
     return db.executeQuery(q, params)
     },*/


}
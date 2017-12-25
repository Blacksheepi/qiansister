
import express from 'express'
import project from '../models/project'

let router = express.Router();

router.post('/', (req, res, next) => {
    let body = req.body;
    let table = body.table;
    let projectName = body.projectName;
    if (!table || !projectName) {
        res.status(400).json({
            msg: '请求参数错误'
        });
    } else {
        project.createProject(table, projectName, (err, data)=> {
        if (err) {
            res.status(500).json({
                msg: '数据存入失败！'
            });
        } else {
            res.status(201).json({
                msg: '数据成功存入！'
            });
        }
    });
    }
});

router.get('/', (req, res, next) => {
    let projectName = req.query.projectName;
    if (!projectName) {
        res.status(400).json({
            msg: '请求参数错误'
        });
    } else {
        let projectDetail;
        let projectInfo;

        project.viewProject(projectName, (err, data) => {
            console.log(222)
            console.log(err)
            console.log(data);
        if (err) {
            res.status(500).json({
                msg: 'something wrong when fetch data.'
            });
        } else {
            console.log('route data', data); 
            let projectDetail = data.projectDetail;
            let projectInfo = data.projectInfo;
            let data = {};
            data.table = projectDetail;
            for (let key of Object.keys(projectInfo)) {
                data[key] = projectInfo[key];
            }
            res.json(data);
            }
        });
    }
});

export default router;
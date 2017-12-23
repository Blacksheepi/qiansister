
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
    }
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
});

router.get('/', (req, res, next) => {
    let projectName = req.query.projectName;
    if (!projectName) {
        res.status(400).json({
            msg: '请求参数错误'
        });
    }
    project.viewProject(projectName, (err, data) => {
    	if (err) {
            res.status(500).json({
            	msg: 'something wrong when fetch data.'
            });
    	} else {
         	res.json(data);
    	}
    });
});

export default router;
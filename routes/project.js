
import express from 'express'
import project from '../models/project'

let router = express.Router();

router.post('/file', (req, res, next) => {
    let file = req.body.file;
})

router.post('/', (req, res, next) => {
    let body = req.body;
    let table = body.table;
    let projectName = body.projectName;
    let projectDescribe = {};

    projectDescribe.projectName = projectName;
    projectDescribe.area = '49.4';
    projectDescribe.position = '上海';
    projectDescribe.type = 's';
    projectDescribe.tgo = 20.4;
    projectDescribe.tg = 4.3;
    projectDescribe.a = 0.72;
    projectDescribe.n = 0.34;
    projectDescribe.cop = 3.42;
    projectDescribe.eer = 2.43;
    projectDescribe.res = 8.88;

    if (!table || !projectName) {
        res.status(400).json({
            msg: '请求参数错误'
        });
    } else {
        project.createProject(table, projectName, projectDescribe ,(err, data)=> {
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
            
        if (err) {
            res.status(500).json({
                msg: 'something wrong when fetch data.'
            });
        } else {
            let projectDetail = data.projectDetail;
            let projectInfo = data.projectInfo[0];

            if (projectDetail && projectInfo) {
                let obj = {};
                obj.table = projectDetail;
                for (let key of Object.keys(projectInfo)) {
                   obj[key] = projectInfo[key];
                }
                res.json(obj);
            } else {
                res.status(400).json({
                    msg: '请求的项目不存在'
                });
            }
        }
        });
    }
});

export default router;
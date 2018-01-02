
import express from 'express'
import project from '../models/project'
import xlsx from 'xlsx'

let router = express.Router();

router.post('/file', (req, res, next) => {
    let file = req.body.file;
})

router.post('/', (req, res, next) => {
    let body = req.body;
    let projectName = body.projectName;
    let area = body.area;
    let position = body.position;
    let type = body.type;
    let excel = body.excel;

    let projectDescribe = {};
    let excelData = {};

    projectDescribe.projectName = projectName;
    projectDescribe.area = '49.4';
    projectDescribe.position = '上海';
    projectDescribe.type = 's';

    let workbook = xlsx.readFile(excel);
    workbook.SheetNames.forEach((sheetName) => {
        let roa = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
        if (roa.length) {
            excelData[sheetName] = roa;
            //console.log(result[sheetName][1]);
            //console.log(result[sheetName]);
            for (let i = 0; i < sheetName; i++) {
            //  console.log(result[sheetName]);
            }
        }
    });
    excelData = excelData[workbook.SheetNames[0]];
    console.log(excelData);
    
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
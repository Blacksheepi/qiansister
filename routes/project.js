
import express from 'express'
import project from '../models/project'
import multer from 'multer'
import xlsx from 'xlsx'

let router = express.Router();
let storage = multer.memoryStorage();
let upload = multer({ 
    storage: storage,
    dest: 'uploads/'  
});

router.post('/file', (req, res, next) => {
    let file = req.body.file;
})

router.post('/', upload.single('excel'), (req, res, next) => {
    let body = req.body;
    let projectName = body.projectName;
    let area = body.area;
    let position = body.position;
    let type = body.type;
    let excelData = {};
    
    const fileBuffer = Buffer.from(req.file.buffer);
    let workbook = xlsx.read(fileBuffer, {type:"buffer"});
    workbook.SheetNames.forEach((sheetName) => {
        let roa = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
        if (roa.length) {
            excelData[sheetName] = roa;
        }
    });
    excelData = excelData[workbook.SheetNames[0]];
    console.log('exceldata',excelData);
    res.json(excelData);
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
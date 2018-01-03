
import express from 'express'
import project from '../models/project'
import projects from '../models/projects'
import multer from 'multer'
import xlsx from 'xlsx'

let router = express.Router();
let storage = multer.memoryStorage();
let upload = multer({ 
    storage: storage,
    dest: 'uploads/'  
});
let fields = [
    {name: 'hotFile', maxCount: 1},
    {name: 'coldFile', maxCount: 1}
];

router.post('/', upload.fields(fields), (req, res, next) => {
    let body = req.body;
    let projectName = body.projectName;
    let area = body.area;
    let position = body.position;
    let type = body.type;
    let beginTime = body.beginTime;
    let hotYear = body.hotYear;
    let coldYear = body.coldYear;
    let id = 0;

    let projectInfo = {};
    projectInfo.projectName = projectName;
    projectInfo.area = area;
    projectInfo.position = position;
    projectInfo.type = type;
    projectInfo.beginTime = beginTime;
    
    projects.addProject(projectInfo, (err, data) => {
        if (err) {
            res.status(500).json({
                msg: '存入数据库失败！'
            });
        } else {
            id = data;
            let files = req.files;
            if (files.hotFile) {
                let hotFile = files.hotFile[0].buffer;
                let hotData = processFile(hotFile);
                saveData(hotData, id, true, hotYear);

            }
            if (files.coldFile) {
                let coldFile = files.coldFile[0].buffer;
                let coldData = processFile(coldFile);
                saveData(coldData, id, false, coldYear);
            }
                }
            });
});

router.get('/projectAveParams', (req, res, next) => {
    let season = req.query.season;
    let hot = true;
    if (season == 1) {
        hot = false;
    }
    projects.getProjectsParams(hot, (err, data) => {
        if (err) {
            res.status(500).json({
                msg: '请求数据失败！'
            });
        } else {
            let aveData = data;
            projects.getProjectsInfo((err, data) => {
                if (err) {
                    res.status(500).json({
                        msg: '请求数据失败！'
                    });
                } else {
                    let infoData = data;
                    for (let aveItem of aveData) {
                        let id = aveItem.project_id;
                        for (let infoItem of infoData) {
                            if (infoItem.id === id) {
                                Object.assign(aveItem, infoItem);
                            }
                        }
                    }
                    console.log(aveData);
                    res.json(aveData);
                }
            });
        }
    });
});

router.get('/projectInfo', (req, res, next) => {
    let id = req.query.id;
    project.getProjectInfo(id, (err, data) => {
        if (err) {
            res.status(500).json({
                msg: '请求数据失败！'
            });
        } else {
            res.json(data);
        }
    });
});

router.get('/projectAllParams', (req, res, next) => {
    let id = req.query.id;
    if (!id) {
        res.status(400).json({
            msg: '请求参数错误'
        });
    } else {

        project.viewProject(id, (err, data) => {
            
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

function saveData (data, projectId, hot, year) {
    let originData = data.originData;
    let aveData = data.aveData;
    aveData.projectId = projectId;
    aveData.hot = hot;
    projects.addProjectAveData(aveData, (err, data) => {
        console.log(err);
    });
    let dbFormatData = {};
    for (let item of originData) {
        dbFormatData[item[0]] = item[1];
    }
    project.createProject(dbFormatData, projectId, year, hot, (err, data) => {
        console.log(err);
    });
}

function processFile(file) {
    console.log(3333)
    let excelData = {};
    let workbook = xlsx.read(file, {type:"buffer"});
    workbook.SheetNames.forEach((sheetName) => {
        let roa = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
        if (roa.length) {
            excelData[sheetName] = roa;
        }
    });
    excelData = excelData[workbook.SheetNames[0]];
    excelData = dataFormat(excelData);
    
    let aveData = {};
    let len = excelData[0][1].length;
    for (let item of excelData) {
        let sum = 0;
        for (let i of item[1]) {
            sum += parseFloat(i);
        }
        aveData[item[0]] = sum/len;
    }
   
    return {
        originData: excelData,
        aveData: aveData
    }

}

function dataFormat(table) {
    console.log(444)
    let columnName = table[0];
    let res = [];
    for (let i=0;i<columnName.length;i++) {
        let item = [];
        let name = columnName[i];
        if (/用户侧供水温度/.test(name)) {
            item.push('tui');
        } else if (/用户侧回水温度/.test(name)) {
            item.push('tuo');
        } else if (/地源侧供水温差/.test(name)) {
            item.push('tgi');
        } else if (/地源侧回水温度/.test(name)) {
            item.push('tgo');
        } else if (/用户侧流量/.test(name)) {
            item.push('gu');
        } else if (/地源侧流量/.test(name)) {
            item.push('gg');
        } else if (/机组总耗电/.test(name)) {
            item.push('pi');
        } else if (/用户侧水泵总耗电/.test(name)) {
            item.push('pu');
        } else if (/地源侧水泵总耗电/.test(name)) {
            item.push('pg');
        }
        item.push([]);
        res.push(item);
    }
    
    for (let i=1;i<table.length;i++) {
        for (let j=0;j<columnName.length;j++) {
            res[j][1].push(table[i][j]);
        }
    }
    return res;
}

export default router;
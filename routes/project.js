
import express from 'express'
import project from '../models/project'
import projects from '../models/projects'
import multer from 'multer'
import xlsx from 'xlsx'
import logger from '../lib/logger'

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

router.post('/', upload.fields(fields), async (req, res, next) => {

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
    
    let files = req.files;

    if (files.hotFile) {

        let hotFile = files.hotFile[0].buffer;
        let hotData = processFile(hotFile);
        //saveData(hotData, id, true, hotYear);
        let originData = hotData.originData;
        let aveData = hotData.aveData; 
        aveData.hot = true;
        //projects.saveProjectAveData(aveData);
        let dbFormatData = {};
        for (let item of originData) {
            dbFormatData[item[0]] = item[1];
        };
        //project.saveProjectParams(dbFormatData, projectId, year, hot);
        try {
            let id = await projects.addProject(projectInfo, aveData, dbFormatData, hotYear, true);    
        } catch (err) {
            logger.err({
                info: 'addProject failed!',
                req: req.body
            }, err);
            res.status(500).json({
                msg: '存入数据库失败！'
            });
            throw err;
        }
    }
    if (files.coldFile) {
        let coldFile = files.coldFile[0].buffer;
        let coldData = processFile(coldFile);
        let originData = coldData.originData;
        let aveData = coldData.aveData;
        aveData.hot = false;
        let dbFormatData = {};
        for (let item of originData) {
            dbFormatData[item[0]] = item[1];
        };
        try {
            let id = await projects.addProject(projectInfo, aveData, dbFormatData, coldYear, false);    
        } catch (err) {
            logger.err({
                info: 'addProject failed!',
                req: req.body
            }, err);
            res.status(500).json({
                msg: '存入数据库失败！'
            });
            throw err;
        }
    }
    res.json({
        id: id
    });
});

router.post('/updateProject', upload.fields(fields), async (req, res, next) => {
    let body = req.body;
    let projectName = body.projectName;
    let area = body.area;
    let position = body.position;
    let type = body.type;
    let beginTime = body.beginTime;
    let hotYear = body.hotYear;
    let coldYear = body.coldYear;
    let id = body.id;

    let projectInfo = {};
    projectInfo.project_name = projectName;
    projectInfo.area = area;
    projectInfo.position = position;
    projectInfo.type = type;
    projectInfo.begin_time = beginTime;

    let files = req.files;

    if (files.hotFile) {
        let hasAveData = false;
        let hotFile = files.hotFile[0].buffer;
        let hotData = processFile(hotFile);
        //saveData(hotData, id, true, hotYear);
        let oldProjectAveData = await projects.getProjectAveData(true, id);
        console.log('oldProjectAveData',oldProjectAveData)
        if (oldProjectAveData[0]) {

            hasAveData = true;
            let newProjectAveData = {};
            for (let oldItem of Object.keys(oldProjectAveData[0])) {
                for (let addItem of Object.keys(hotData.aveData)) {
                    if (addItem === oldItem) {
                        newProjectAveData[addItem] = (oldProjectAveData[0][oldItem] + hotData.aveData[addItem])/2
                    }
                }
            }
            newProjectAveData.id = oldProjectAveData[0].id;
            hotData.aveData = newProjectAveData;
        }
        let originData = hotData.originData;
        let aveData = hotData.aveData; 
        aveData.hot = true;
        //projects.saveProjectAveData(aveData);
        let dbFormatData = {};
        for (let item of originData) {
            dbFormatData[item[0]] = item[1];
        };
        //project.saveProjectParams(dbFormatData, projectId, year, hot);
        try {
            await projects.updateProject(projectInfo, aveData, dbFormatData, hotYear, true, id, hasAveData);    
        } catch (err) {
            logger.err({
                info: 'addProject failed!',
                req: req.body
            }, err);
            res.status(500).json({
                msg: '存入数据库失败！'
            });
            throw err;
        }
    }
    if (files.coldFile) {
        let hasAveData = false;
        let coldFile = files.coldFile[0].buffer;
        let coldData = processFile(coldFile);
        //saveData(hotData, id, true, hotYear);
        let oldProjectAveData = await projects.getProjectAveData(true, id);
        console.log('oldProjectAveData',oldProjectAveData)
        if (oldProjectAveData[0]) {

            hasAveData = true;
            let newProjectAveData = {};
            for (let oldItem of Object.keys(oldProjectAveData[0])) {
                for (let addItem of Object.keys(coldData.aveData)) {
                    if (addItem === oldItem) {
                        newProjectAveData[addItem] = (oldProjectAveData[0][oldItem] + coldData.aveData[addItem])/2
                    }
                }
            }
            newProjectAveData.id = oldProjectAveData[0].id;
            coldData.aveData = newProjectAveData;
        }
        let originData = coldData.originData;
        let aveData = coldData.aveData; 
        aveData.hot = false;
        //projects.saveProjectAveData(aveData);
        let dbFormatData = {};
        for (let item of originData) {
            dbFormatData[item[0]] = item[1];
        };
        //project.saveProjectParams(dbFormatData, projectId, year, hot);
        try {
            await projects.updateProject(projectInfo, aveData, dbFormatData, hotYear, false, id, hasAveData);    
        } catch (err) {
            logger.err({
                info: 'addProject failed!',
                req: req.body
            }, err);
            res.status(500).json({
                msg: '存入数据库失败！'
            });
            throw err;
        }
    }
    res.json({
        id: id
    });

    // try {
    //     await project.updateProjectInfo(projectInfo, id)

    //     let files = req.files;
    //     if (files.hotFile) {
    //         let hotFile = files.hotFile[0].buffer;
    //         let hotData = processFile(hotFile);
    //         let oldProjectAveData = await projects.getProjectAveData(true, id);
    //         if (oldProjectAveData[0]) {
    //             let newProjectAveData = {};
    //             for (let oldItem of Object.keys(oldProjectAveData[0])) {
    //                 for (let addItem of Object.keys(hotData.aveData)) {
    //                     if (addItem === oldItem) {
    //                         newProjectAveData[addItem] = (oldProjectAveData[0][oldItem] + hotData.aveData[addItem])/2
    //                     }
    //                 }
    //             }
    //             newProjectAveData.id = oldProjectAveData[0].id;
    //             hotData.aveData = newProjectAveData;
    //             saveData(hotData, id, true, hotYear, true);
    //         } else {
    //             saveData(hotData, id, true, hotYear, false);
    //         }
    //     }
    //     if (files.coldFile) {
    //         let coldFile = files.coldFile[0].buffer;
    //         let coldData = processFile(coldFile);
    //         let oldProjectAveData = await projects.getProjectAveData(false, id);
    //         if (oldProjectAveData[0]) {
    //             let newProjectAveData = {};
    //             for (let oldItem of Object.keys(oldProjectAveData[0])) {
    //                 for (let addItem of Object.keys(coldData.aveData)) {
    //                     if (addItem === oldItem) {
    //                         newProjectAveData[addItem] = (oldProjectAveData[0][oldItem] + coldData.aveData[addItem])/2
    //                     }
    //                 }
    //             }
    //             newProjectAveData.id = oldProjectAveData[0].id;
    //             coldData.aveData = newProjectAveData;
    //             saveData(coldData, id, false, coldYear, true);
    //         } else {
    //             saveData(coldData, id, false, coldYear, false);
    //         }
    //     }
    //     res.json({
    //         id: id
    //     });

    // } catch (err) {
    //     logger.err({
    //         info: 'updateProject failed!',
    //         req: req.body
    //     }, err);
    //     res.status(500).json({
    //         msg: '存入数据库失败！'
    //     })
    // }
})

router.get('/projectAveParams', async (req, res, next) => {
    let season = req.query.season;
    let hot = true;
    if (season == 1) {
        hot = false;
    }
    try {
        let aveData = await projects.getProjectsParams(hot);
        let infoData = await projects.getProjectsInfo();    

        for (let aveItem of aveData) {
            let id = aveItem.project_id;
            for (let infoItem of infoData) {
                if (infoItem.id === id) {
                    Object.assign(aveItem, infoItem);
                }
            }
        }
        res.json(aveData);
    } catch (err) {
        logger.err({
            info: 'getProjectAveParams failed!',
            req: req.qruey
        }, err);
        res.status(500).json({
            msg: '获取数据失败！'
        })
    }
});

router.get('/projectInfo', async (req, res, next) => {
    let id = req.query.id;

    try {
        let data = await project.getProjectInfo(id);
        res.json(data[0]);
    } catch (err) {
        logger.err({
            info: 'getProjectInfo failed!',
            req: req.qruey
        }, err);
        res.status(500).json({
            msg: '获取数据失败！'
        })
    }
});

router.get('/projectAllParams', async (req, res, next) => {
    let id = req.query.id;
    if (!id) {
        res.status(400).json({
            msg: '请求参数错误'
        });
    } else {

        try {
            let projectParams = await project.getProjectParams(id);
            let projectInfo = await project.getProjectInfo(id); 
            if (projectParams && projectInfo[0]) {
                let obj = {};
                obj.table = projectParams;
                for (let key of Object.keys(projectInfo[0])) {
                    obj[key] = projectInfo[0][key];
                }
                res.json(obj);
            }
        } catch (err) {
            logger.err({
                info: 'getProjectALLParams failed!',
                req: req.qruey
            }, err);
            res.status(500).json({
                msg: '获取数据失败！'
            })
        }
    }
});

function saveData (data, projectId, hot, year, update) {
    let originData = data.originData;
    let aveData = data.aveData;
    aveData.project_id = projectId;
    aveData.hot = hot;
    if (update) {
        projects.updateProjectAveData(aveData, aveData.id);
    } else {
        projects.saveProjectAveData(aveData);
    }
    let dbFormatData = {};
    for (let item of originData) {
        dbFormatData[item[0]] = item[1];
    }
    project.saveProjectParams(dbFormatData, projectId, year, hot);
}

function processFile(file) {
    let excelData = {};
    let workbook = xlsx.read(file, {type:"buffer"});
    workbook.SheetNames.forEach((sheetName) => {
        let roa = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
        if (roa.length) {
            excelData[sheetName] = roa;
        }
    });
    excelData = excelData[workbook.SheetNames[0]];
    let tempExeclData = [];
    for (let item of excelData) {
        if (item.length > 0) {
            tempExeclData.push(item);
        }
    }
    excelData = tempExeclData;
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
            item.push('pl');
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
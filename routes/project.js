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
    let area = body.area ? parseFloat(body.area) : null;
    let position = body.position;
    let type = body.type;
    let beginTime = body.beginTime;
    let hotYear = body.hotYear;
    let coldYear = body.coldYear;
    let id;

    let projectInfo = {};
    projectInfo.projectName = projectName;
    projectInfo.area = area;
    projectInfo.position = position;
    projectInfo.type = type;
    projectInfo.beginTime = beginTime;
    console.log('reqBody', projectInfo);

    let files = req.files;

    if (files.hotFile) {

        let hotFile = files.hotFile[0].buffer;
        let hotData;
        try {
            hotData = processFile(hotFile);
        } catch (err) {
            res.status(400).json({
                msg: '请使用给定模板文件添加数据后上传！'
            });
            return;
        }
        //saveData(hotData, id, true, hotYear);
        let originData = hotData.originData;
        let aveData = hotData.aveData;
        aveData.hot = true;
        //projects.saveProjectAveData(aveData);
        let dbFormatData = {};
        for (let item of originData) {
            dbFormatData[item[0]] = item[1];
        }
        //project.saveProjectParams(dbFormatData, projectId, year, hot);
        try {
            id = await projects.addProject(projectInfo, aveData, dbFormatData, hotYear, true);
            if (!files.coldFile) {
                res.json({
                    id: id
                });
                return;
            }
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
        let coldData;
        try {
            coldData = processFile(coldFile);
        } catch (err) {
            res.status(400).json({
                msg: '请使用给定模板文件添加数据后上传！'
            });
            return;
        }
        let originData = coldData.originData;
        let aveData = coldData.aveData;
        aveData.hot = false;
        let dbFormatData = {};
        for (let item of originData) {
            dbFormatData[item[0]] = item[1];
        }
        ;
        try {
            console.log('idddddddddddddddddd', id);
            if (id) {
                await projects.addProject(projectInfo, aveData, dbFormatData, coldYear, false, true, id);
                res.json({
                    id: id
                });
            } else {
                let id = await projects.addProject(projectInfo, aveData, dbFormatData, coldYear, false, false);
                res.json({
                    id: id
                });
            }
            return;
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
    } else {
        try {
            let id = await projects.addProjectInfo(projectInfo);
            res.json({
                id: id
            })
        } catch (err) {
            logger.err({
                info: 'addProject failed!',
                req: req.body,
            }, err);
            res.status(500).json({
                msg: '存入数据库失败！'
            });
            throw err;
        }
    }

});

router.post('/updateProject', upload.fields(fields), async (req, res, next) => {
    let body = req.body;
    let projectName = body.projectName;
    let area = body.area ? parseFloat(body.area) : null;
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
        let hotData;
        try {
            hotData = processFile(hotFile);
        } catch (err) {
            res.status(400).json({
                msg: '请使用给定模板文件添加数据后上传！'
            });
            return;
        }
        console.log('222222');
        //saveData(hotData, id, true, hotYear);
        let oldProjectAveData = await projects.getProjectAveData(true, id);
        console.log('oldProjectAveData', oldProjectAveData)
        if (oldProjectAveData[0]) {
            hasAveData = true;
            let newProjectAveData = {};
            for (let oldItem of Object.keys(oldProjectAveData[0])) {
                for (let addItem of Object.keys(hotData.aveData)) {
                    if (addItem === oldItem) {
                        if (oldProjectAveData[0][oldItem] && hotData.aveData[addItem]) {
                            newProjectAveData[addItem] = (oldProjectAveData[0][oldItem] + hotData.aveData[addItem]) / 2;
                        } else if (!oldProjectAveData[0][oldItem] && !hotData.aveData[addItem]) {
                            newProjectAveData[addItem] = null;
                        } else {
                            newProjectAveData[addItem] = oldProjectAveData[0][oldItem] ? oldProjectAveData[0][oldItem] : hotData.aveData[addItem];
                        }
                    }
                }
            }
            newProjectAveData.id = oldProjectAveData[0].id;
            hotData.aveData = newProjectAveData;
        }
        let originData = hotData.originData;
        let aveData = hotData.aveData;
        console.log('aveDataaaaaaa', aveData);
        aveData.hot = true;
        //projects.saveProjectAveData(aveData);
        let dbFormatData = {};
        for (let item of originData) {
            dbFormatData[item[0]] = item[1];
        }
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
        let coldData;
        try {
            coldData = processFile(coldFile);
        } catch (err) {
            res.status(400).json({
                msg: '请使用给定模板文件添加数据后上传！'
            });
            return;
        }
        //saveData(hotData, id, true, hotYear);
        let oldProjectAveData = await projects.getProjectAveData(false, id);
        console.log('oldProjectAveData', oldProjectAveData)
        if (oldProjectAveData[0]) {
            hasAveData = true;
            let newProjectAveData = {};
            for (let oldItem of Object.keys(oldProjectAveData[0])) {
                for (let addItem of Object.keys(coldData.aveData)) {
                    if (addItem === oldItem) {
                        if (oldProjectAveData[0][oldItem] && coldData.aveData[addItem]) {
                            newProjectAveData[addItem] = (oldProjectAveData[0][oldItem] + coldData.aveData[addItem]) / 2;
                        } else if (!oldProjectAveData[0][oldItem] && !coldData.aveData[addItem]) {
                            newProjectAveData[addItem] = null;
                        } else {
                            newProjectAveData[addItem] = oldProjectAveData[0][oldItem] ? oldProjectAveData[0][oldItem] : coldData.aveData[addItem];
                        }
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
        }
        //project.saveProjectParams(dbFormatData, projectId, year, hot);
        try {
            await projects.updateProject(projectInfo, aveData, dbFormatData, coldYear, false, id, hasAveData);
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
    } else {
        try {
            projects.updateProjectInfo(projectInfo, id);
            res.json({msg: 'update success!'})
        } catch (err) {
            logger.err({
                info: 'updateProject failed!',
                req: req.body
            }, err);
            res.status(500).json({
                msg: '更新失败！'
            });
            throw err;
        }
    }
    res.json({msg: 'update success!'});
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

function processFile(file) {
    let excelData = {};
    let workbook = xlsx.read(file, {type: "buffer"});

    workbook.SheetNames.forEach((sheetName) => {
        let roa = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {header: 1});
        if (roa.length) {
            excelData[sheetName] = roa;
        }
    });
    excelData = excelData[workbook.SheetNames[0]];

    console.log('origin excelData', excelData);
    let tempExeclData = [];
    for (let item of excelData) {
        if (item.length > 0) {
            tempExeclData.push(item);
        }
    }
    //var table=[['time','gg','gu','tui'],['2018/1/1 00:00',1,2,3],['2018/1/1 01:00',4,5,6]];
    excelData = tempExeclData;
    excelData = dataFormat(excelData);
    console.log('after formarttttttt', excelData)
    let aveData = {};
    for (let item of excelData) {
        let sum = 0;
        let counter = 0;
        for (let i of item[1]) {
            if (i) {
                counter++;
                sum += parseFloat(i);
            }
        }
        if (counter > 0) {
            aveData[item[0]] = sum / counter;
        } else {
            aveData[item[0]] = null;
        }
    }
    console.log('aveDataaaaa', aveData)
    return {
        originData: excelData,
        aveData: aveData
    }

}

function dataFormat(table) {
    console.log('dataFormat');

    let reverseData = [];
    for (let item of table[0]) {
        reverseData.push([]);
    }

    for (let item of table) {
        for (let i = 0; i < table[0].length; i++) {
            reverseData[i].push(item[i]);
        }
    }
    console.log('reverseData', reverseData)
    let res = [];
    for (let i = 0; i < reverseData.length; i++) {
        let item = [];
        let name = reverseData[i][0];
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
        } else if (name === 'P' || name === 'p') {
            item.push('p');
        } else if (name === 'P2' || name === 'p2') {
            item.push('p2')
        }
        if (item.length > 0) {
            let arr = [];
            for (let dataItem of reverseData[i]) {
                if (dataItem === undefined) {
                    arr.push(null);
                } else {
                    arr.push(dataItem);
                }
            }
            console.log(arr);
            item.push(arr.slice(1));
            res.push(item);
        }
    }
    return res;
}


export default router;
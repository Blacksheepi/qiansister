/**
 * Created by haoqianhuang on 2018/3/22.
 */
import express from 'express'
import dataProject from '../models/dataProject'
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

router.get('/', async (req, res, next) => {
    try {
        let data = await dataProject.getProjectsInfo();
        res.json(data);
    } catch (err) {
        logger.err({
            info: 'get data Projects failed!'
        }, err)
        throw err;
    }
});

router.get('/getProjectById', async (req, res, next) => {
    let id = req.query.id;

    try {
        let data = await dataProject.getProjectById(id);
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

router.get('/getProjectsParamsByIdAndYear', async (req, res, next) => {
    let id = req.query.id;
    let year = req.query.year.toString();
    if (!id) {
        res.status(400).json({
            msg: '请求参数错误'
        });
    } else {
        try {
            let project = await dataProject.getProjectById(id);
            let projectParams = [];
            if (project.length > 0) {
                projectParams = await dataProject.getProjectsParamsByIdAndYear(id, year);
            }
            let projectObj = {
                id: id,
                name: project.length > 0 ? project[0].name : '',
                table: projectParams
            };
            res.json(projectObj);
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

router.post('/', upload.fields(fields), async (req, res, next) => {

    let body = req.body;
    let name = body.name;
    let hotYear = body.hotYear;
    let coldYear = body.coldYear;
    let id;

    let projectInfo = {};
    projectInfo.name = name;

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

        let dbFormatData = {};
        for (let item of originData) {
            dbFormatData[item[0]] = item[1];
        }

        try {
            id = await dataProject.addProject(projectInfo, dbFormatData, hotYear, true);
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

        let dbFormatData = {};
        for (let item of originData) {
            dbFormatData[item[0]] = item[1];
        }

        try {
            if (id) {
                await dataProject.addProject(projectInfo, dbFormatData, coldYear, false, true, id);
                res.json({
                    id: id
                });
            } else {
                let id = await dataProject.addProject(projectInfo, dbFormatData, coldYear, false, false);
                res.json({
                    id: id
                });
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
    } else {
        try {
            let id = await dataProject.addProjectInfo(projectInfo);
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
    let name = body.name;
    let hotYear = body.hotYear;
    let coldYear = body.coldYear;
    let id = body.id;

    let projectInfo = {};
    projectInfo.name = name;

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

        let originData = hotData.originData;

        let dbFormatData = {};
        for (let item of originData) {
            dbFormatData[item[0]] = item[1];
        }
        try {
            await dataProject.updateProject(projectInfo, dbFormatData, hotYear, true, id);
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

        let dbFormatData = {};
        for (let item of originData) {
            dbFormatData[item[0]] = item[1];
        }
        try {
            await dataProject.updateProject(projectInfo, dbFormatData, coldYear, false, id);
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
            await dataProject.updateProjectInfo(projectInfo, id);
            res.json({msg: 'update success!'})
        } catch (err) {
            logger.err({
                info: 'update Project failed!',
                req: req.body
            }, err);
            res.status(500).json({
                msg: '更新失败！'
            });
            throw err;
        }
    }
    res.json({msg: 'update success!'})
})

router.delete('/delete', (req, res, next) => {

    let id = req.query.id;
    try {
        dataProject.deleteProject(id);
        res.json({
            msg: 'delete success!',
        })
    } catch (err) {
        logger.err({
            info: 'delete data Project failed!',
            req: id
        }, err)
        throw err;
    }
})

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

    let tempExeclData = [];
    for (let item of excelData) {
        if (item.length > 0) {
            tempExeclData.push(item);
        }
    }
    excelData = tempExeclData;
    excelData = dataFormat(excelData);
    return {
        originData: excelData,
    }
}

function dataFormat(table) {
    let reverseData = [];
    for (let item of table[0]) {
        reverseData.push([]);
    }
    for (let item of table) {
        for (let i = 0; i < table[0].length; i++) {
            reverseData[i].push(item[i]);
        }
    }
    let res = [];
    for (let i = 0; i < reverseData.length; i++) {
        let item = [];
        let name = reverseData[i][0];
        if (/时间/.test(name)) {
            item.push('time');
        } else if (/用户进口/.test(name)) {
            item.push('tui');
        } else if (/用户出口/.test(name)) {
            item.push('tuo');
        } else if (/源侧进口/.test(name)) {
            item.push('tgi');
        } else if (/源侧出口/.test(name)) {
            item.push('tgo');
        } else if (/用户侧/.test(name)) {
            item.push('gu');
        } else if (/地源侧/.test(name)) {
            item.push('gg');
        }
        if (item.length > 0) {
            let arr = [];
            for (let dataItem of reverseData[i]) {
                if (!dataItem && dataItem !== 0) {
                    arr.push(null);
                } else {
                    arr.push(dataItem);
                }
            }
            item.push(arr.slice(1))
            res.push(item);
        }
    }
    return res;
}

export default router;
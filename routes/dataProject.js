/**
 * Created by haoqianhuang on 2018/3/22.
 */
import express from 'express'
import dataProject from '../models/dataProject'
import multer from 'multer'
import xlsx from 'xlsx'
import moment from 'moment'
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

router.get('/getParamsByIdAndYearAndSeaon', async (req, res, next) => {
    let id = req.query.id;
    let year = req.query.year.toString();
    let isHot = req.query.isHot;
    if (!id) {
        res.status(400).json({
            msg: '请求参数错误'
        });
    } else {
        try {
            let projectParams = await dataProject.getParamsByIdAndYearAndSeaon(id, year, isHot);
            console.log(projectParams.length);
            res.json(projectParams);
        } catch (err) {
            logger.err({
                info: 'getParamsByIdAndYearAndSeaon failed!',
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
            hotData = processFile(hotFile, hotYear, true);
        } catch (err) {
            console.log(err);
            res.status(400).json({
                msg: err.message
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
            coldData = processFile(coldFile, coldYear, false);
        } catch (err) {
            console.log(err);
            res.status(400).json({
                msg: err.message
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
    let files = req.files;

    let name = body.name;
    let hotYear = body.hotYear;
    let coldYear = body.coldYear;
    let id = body.id;

    let projectInfo = {};
    projectInfo.name = name;


    if (files.hotFile) {

        let hotFile = files.hotFile[0].buffer;
        let hotData;
        try {
            hotData = processFile(hotFile, hotYear, true);
        } catch (err) {
            console.log(err);
            res.status(400).json({
                msg: err.message
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
            coldData = processFile(coldFile, coldYear, false);
        } catch (err) {
            console.log(err);
            res.status(400).json({
                msg: err.message
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
});

/*function updateProject(projectInfo, file, year, isHot, id) {
 let data;

 try {
 data = processFile(file);
 } catch (err) {
 throw new Error(-5);
 }
 let originData = data.originData;

 let dbFormatData = {};
 for (let item of originData) {
 dbFormatData[item[0]] = item[1];
 }
 return dataProject.updateProject(projectInfo, dbFormatData, year, isHot, id);
 }*/

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

function processFile(file, year, isHot) {
    try {
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
        if (!excelData || (excelData.length > 0 && excelData[0].length <= 0)) {
            throw new Error('没有解析出Excel数据，您的Excel为空。请按照模板上传数据。');//empty excel
        } else if (excelData.length < 2 || excelData[1].length <= 0) {
            throw new Error('不能上传没有数据的表格！（您上传的表格需要包括表头和至少一条数据）');//data not enough
        }

        let tempExeclData = [];
        for (let item of excelData) {
            if (item.length > 0) {
                tempExeclData.push(item);
            }
        }
        excelData = tempExeclData;
        excelData = dataFormat(excelData, year, isHot);
        return {
            originData: excelData,
        }
    } catch (err) {
        console.error(err);
        if (err.message) {
            throw  new Error(err.message);
        } else {
            throw new Error('您上传的数据有问题，请按照模板格式上传！');
        }
    }
}

function dataFormat(table, year, isHot) {
    try {
        let reverseData = [];
        for (let item of table[0]) {
            reverseData.push([]);
        }
        for (let item of table) {
            for (let i = 0; i < table[0].length; i++) {
                reverseData[i].push(item[i]);
            }
        }
        //console.log('reverseData', reverseData);
        /*reverseData:
         [
         [ '时间','2018/3/27 0:00','2018/3/27 1:00','2018/3/27 2:00'],
         [ '源侧出口/℃','12.1','13.3','11.8'],
         [ '源侧进口/℃','8.9','9.4','9.7'],
         [ '用户出口/℃','32.7','32.8', '32.6'],
         [ '用户进口/℃','35.4','35.2', '34.7'],
         [ '地源侧/(m3/h)','326.9','327.2','275.0' ],
         [ '用户侧(m3/h)','96.2','95.6','94.3']
         ]*/
        let res = [];
        for (let i = 0; i < reverseData.length; i++) {
            let item = [];
            let name = reverseData[i][0];
            if (/时间/.test(name)) {
                item.push('time');
                //console.log('reverseData[' + i + ']:', reverseData[i]);
                let list = reverseData[i];
                list = list.slice(1);
                let timeArr = list.map((item) => {
                    let startDate = isHot ? new Date(year + "/11/20 0:00") : new Date(year + "/4/15 0:00");
                    let endDate = isHot ? new Date((parseInt(year) + 1).toString() + "/4/14 23:00") : new Date(year + "/11/19 23:00");
                    if (moment(new Date(item)) && !moment(new Date(item)).isAfter(endDate) && !moment(new Date(item)).isBefore(startDate)) {
                        let time = moment(new Date(item)).format('YYYY/MM/DD HH:mm');
                        return time;
                    } else {
                        console.log('map', item);// 2019/4/14 1:00
                        console.log('startDate', startDate);//2018/11/20
                        console.log('endDate', endDate);//2019/4/14 23：00
                        console.log('isBefore', moment(new Date(item)).isBefore(endDate));
                        console.log('isAfter', moment(new Date(item)).isAfter(endDate));
                        console.log('isBetween', moment(new Date(item)).isBetween(startDate, endDate));
                        throw new Error('您上传的数中有不属于' + year + '年' + (isHot ? '供暖季' : '供冷季') + '的时间（比如：' + item + '），请检查后上传!');
                    }
                });
                item.push(timeArr);
                res.push(item);
                continue;
            } else if (/用户侧进口/.test(name)) {//用户进口
                item.push('tui');
            } else if (/用户侧出口/.test(name)) {//用户出口
                item.push('tuo');
            } else if (/地源侧进口/.test(name)) {//源侧进口
                item.push('tgi');
            } else if (/地源侧出口/.test(name)) {//源侧出口
                item.push('tgo');
            } else if (/用户侧流量/.test(name)) {//用户侧
                item.push('gu');
            } else if (/地源侧流量/.test(name)) {//地源侧
                item.push('gg');
            }
            if (item.length > 0) {
                let arr = [];
                for (let dataItem of reverseData[i]) {
                    //console.log('dataItem[' + i + ']:', dataItem);
                    if (!dataItem && dataItem !== 0) {
                        arr.push(null);
                    } else {
                        arr.push(dataItem);
                    }
                }
                item.push(arr.slice(1))
                //console.log('item[' + i + ']:', item);
                res.push(item);
            }
        }
        //res:
        //[
        // [ 'time',[ '2018/3/27 0:00','2018/3/27 1:00','2018/3/27 2:00']],
        // [ 'tgo',[ '12.1','13.3','11.8']],
        //]
        return res;
    } catch (err) {
        console.error(err);
        if (err.message) {
            throw  new Error(err.message);
        } else {
            throw new Error('您上传的数据有问题，请按照模板格式上传！');
        }
    }
}

export default router;
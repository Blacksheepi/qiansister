import express from 'express'
import projects from '../models/projects'
import logger from '../lib/logger'

let router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        let data = await projects.getProjectsInfo();
        res.json(data);
    } catch (err) {
        logger.err({
            info: 'getProjects failed!'
        }, err)
        throw err;
    }
});

router.delete('/', async (req, res, next) => {

    let id = req.query.id;
    try {
        let re = await projects.deleteProject(id);
        //let data = await projects.getProjectsInfo();

        res.json({
            msg: 'delete success!',
            length: re
        })
    } catch (err) {
        logger.err({
            info: 'delete Project failed!',
            req: id
        }, err)
        throw err;
    }
});


router.delete('/deleteSeasonData', async (req, res, next) => {

    let id = req.query.id;
    let isHot = req.query.isHot;
    try {
        console.log('id', id);
        console.log('isHot', isHot);
        await projects.deleteSeasonData(id, isHot);
        //let data = await projects.getProjectsInfo();
        res.json({
            msg: 'deleteSeasonData success!',
            id: id
        })
    } catch (err) {
        logger.err({
            info: 'delete deleteSeasonData failed!',
            req: id
        }, err);
        throw err;
    }
});

export default router;
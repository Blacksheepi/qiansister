
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
    }
});

export default router;

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

router.delete('/', (req, res, next) => {

	let id = req.query.id;
	try {
		projects.deleteProject(id);
		res.json({
			msg: 'delete success!'
		})
	} catch (err) {
		 logger.err({
            info: 'delete Project failed!',
            req: id
        }, err)
        throw err;
	}
})

export default router;

import express from 'express'
import projects from '../models/projects'
import logger from '../lib/logger'

let router = express.Router();

router.get('/', (req, res, next) => {
    projects.getProjectsInfo((err, data) => {
    	if (err) {
    		logger.err(err);
    		res.status(500).json({
    			msg: '请求数据失败！'
    		});
    	} else {
            res.json(data);
    	}
    });
});

export default router;
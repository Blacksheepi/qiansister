
import express from 'express'
import projects from '../models/projects'

let router = express.Router();

router.get('/', (req, res, next) => {
    let data = projects.getProjectsInfo((err, data) => {
    	if (err) {
    		res.status(500).json({
    			msg: '请求数据失败！'
    		});
    	} else {
            res.json(data);
    	}
    });
});

export default router;
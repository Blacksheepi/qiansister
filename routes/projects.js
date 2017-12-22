
import express from 'express'
import projects from '../models/projects'

let router = express.Router();

router.get('/', (req, res, next) => {
    let data = projects.getProjectsInfo((data) => {
    	console.log('dddddd', data);
    	res.json(data);
    });
});

export default router;
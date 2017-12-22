
import express from 'express'
import project from '../models/project'

let router = express.Router();

router.post('/', (req, res, next) => {
    let body = req.body;
    let table = body.table;
    let projectName = body.projectName;
    project.createProject(table, projectName, (data)=> {
    	console.log(data);
    });
});

router.get('/', (req, res, next) => {

});

export default router;
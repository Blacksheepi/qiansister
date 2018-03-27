import home from './home'
import users from './users'
import login from './login'
import projects from './projects'
import project from './project'
import dataProject from './dataProject'
import passport from 'passport'
import path from 'path'


export default app => {
	//app.use('/', home);
	app.use('/users', passport.authMiddleware, users);
	app.use('/login', login);
	app.use('/projects', passport.authMiddleware, projects);
	app.use('/project', passport.authMiddleware, project);
	app.use('/dataProject', passport.authMiddleware, dataProject);
	app.use('/templateFile' ,(req, res, next) => {

		var options = {
            root: path.resolve(__dirname, '..') + '/file/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };
		res.sendFile('templateFile.xlsx', options, (err) => {
			if (err) {
				next(err);
			}
		});
	});
    app.use('/dataTemplateFile' ,(req, res, next) => {

        var options = {
            root: path.resolve(__dirname, '..') + '/file/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true
            }
        };
        res.sendFile('dataTemplateFile.xlsx', options, (err) => {
            if (err) {
                next(err);
            }
        });
    })
}
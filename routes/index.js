import home from './home'
import users from './users'
import login from './login'
import projects from './projects'
import project from './project'


export default app => {
	//app.use('/', home);
	app.use('/users', users);
	app.use('/login', login);
	app.use('/projects', projects);
	app.use('/project', project);
}
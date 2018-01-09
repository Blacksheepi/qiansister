export default {
	userAuth () {
		if (!req.session || !req.session.userAuthenticated) {
			res.redirect('/login');
			return;
		}
		next();
	}
}
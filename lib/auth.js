import passport from 'passport'
import localStrategy from 'passport-local'
import user from '../models/user'

export default () => {
    passport.use(new localStrategy.Strategy({
        usernameField: 'username',
        passwordField: 'password'
    }, async(username, password, done) => {

        let userInfo = null;
        let passEnc = null;

        try {
            userInfo = await user.getUserByUsername(username);
            passEnc = userInfo.password;
        } catch (e) {
            return done(e);
        }
        user.comparePassword(password, passEnc, (err, res) => {
            if (err) {
                return done(err);
            }
            if (res) {
                return done(null, userInfo);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        });
    }));

    passport.authMiddleware = (req, res, next) => {
        // if (req.isAuthenticated()) {
        // 	console.log('login success')
        // 	return next();
        // } else {
        // 	console.log('login failed')
        // 	res.status(401).json({
        // 		type: 'request',
        // 		msg: 'Not authenticated!'
        // 	});
        // }
        return next();
    }
}
import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'
import compression from 'compression'
import passport from 'passport'
import redis from 'redis'
import connectRedis from 'connect-redis'

import index from './routes/index'
import users from './routes/users'
import router from './routes/index'
import config from './configs/global/config'
import setPassport from './lib/auth'

let app = express();

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1')
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.use(compression());   //compression sending to user content use gzip

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//本地要注释掉的
// let redisClient = redis.createClient();
// let redisStore = connectRedis(session);
// app.use(session({
//    name: config.session.name,
//    secret: config.session.secret,
//    resave: true,
//    saveUninitialized: false,
//    cookie: config.session.cookie,
//    store: new redisStore({
//     host: config.redisStore.host,
//     port : config.redisStore.port,
//     client: redisClient,
//     ttl: config.redisStore.ttl
//    })
// }));

// use this middleware to reset cookie expiration time
// when user hit page every time
// app.use(function(req, res, next){
//     req.session._garbage = Date();
//     req.session.touch();
//     next();
// });
//到这里为止

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

setPassport();
app.use(passport.initialize());
app.use(passport.session());

router(app);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;

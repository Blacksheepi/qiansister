import devConfig from './config-dev'
import prodConfig from './config-prod'

let env = process.env.NODE_ENV;
let res;

if (typeof env !== 'undefined') {
    if (env === 'dev') {
        res = devConfig;
    } else if (env === 'prod') {
    	res = prodConfig;
    }
}

export default res;
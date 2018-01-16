import db from '../lib/db'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import uuid from 'uuid'

export default {
	/**
	* Encrypt password
	* @param {[type]} pass
	* @param {Function} callback
	* @param {[type]}
	*/
	encryptPassword (pass) {
		return new Promise((resolve, reject) => {
			let passCrypto = crypto.createHash('md5').update(pass + '{happy}').digest("hex");
            let saltRounds = 10;
            bcrypt.hash(passCrypto, saltRounds, function(err, hash) {
            	if (err) {
            		reject(err);
            	} else {
            		resolve(hash);
            	}
            });
		}); 
	},
	getUserByUsername (username) {
		let q = 'SELECT * FROM users WHERE username = $1';
		return db.getOne(q, [username]);
	},
	/**
	* Compare the raw password with the hashed password
	* @param {[type]} pass
	* @param {[type]} hash
	* @param {Function} callback
	* @return {[type]}
	*/
	comparePassword (pass, passEnc, callback) {

		let key = '{happy}';
		let passCrypto = crypto.createHash('md5').update(pass + key).digest('hex');

		bcrypt.compare(passCrypto, passEnc, (error, res) => {
			if (res) {
				callback(error, true);
			} else {
				callback(error, false);
			}
		});
	},
	/**
	* Create new account
	* @param {Object} data
	* @param {Function} callback
	*/
	register (data) {
		return new Promise(async (resolve, reject) => {
			let username = data.username;
		    let password = data.password;    

    		let q = `INSERT INTO users (user_id, username, password) VALUES ($1, $2, $3)`;
    		try {
    			let passwordEnc = await this.encryptPassword(password)
    		    let id = uuid.v4();
    		    await db.executeQuery(q, [id, username, passwordEnc]);
    		    resolve(id);
    		} catch (e) {
    			reject(e);
    		}
		});
	}

}
















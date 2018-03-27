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
	encryptPassword (pass, callback) {
        let passCrypto = crypto.createHash('md5').update(pass + '{happy}').digest("hex");
        let saltRounds = 10;
        bcrypt.hash(passCrypto, saltRounds, function(err, hash) {
        	callback;
        });
	},
	/**
	* Compare the raw password with the hashed password
	* @param {[type]} pass
	* @param {[type]} hash
	* @param {Function} callback
	* @return {[type]}
	*/
	comparePassword (pass, passEnc, source, callback) {
		if (typeof source === 'function') {
			callback = source;
			source = '';
		}

		let key = (source && (source.replace(/\s+/g, '') === 'OLD_B2B')) ? '' : '{happy}';
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
	register (data, callback) {
		let username = data.username;
		let password = data.password;

		var q = `INSERT INTO users (user_id, username, password) VALUES ($1, $2)`,
		this.encryptPassword(password, (err, passwordEnc) {
			let id = uuid.v4();
			db.executeQuery(q, [id, username, passwordEnc], (err, data) {
				callback(err, {user_id: id});
			});
		});
	}

}
















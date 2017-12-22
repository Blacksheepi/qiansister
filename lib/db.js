import pg from 'pg'
import config from '../configs/global/config'

const conString = `postgres://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`;
const pool = new pg.Pool(config.db)
const db = {};

/**
* Execute a query, and return the results.
*
* @param {String} sql
* @param {Array} params
* @param {Function} callback
* @param {[type]}
*/
db.executeQuery = (sql, params, callback) => {
	pool.connect((err, client, done) => {
		if (err) {
			console.error('error fetching client from pool', err);
			return callback(err, null);
		}

		client.query(sql, params, (err, result) => {
			//call `done()` to release the client back to the pool
			done();
			if (err) {
				console.error('error running query', err);
				return callback(err);
			}
			callback(null, result.rows);
		});
	});
};

/**
* Update record for fields
* @param {String} tableName
* @param {String} idColumnName
* @param {Int} idValue
* @param {Object} fields object where keys are columns and values are new values
* @param {Function} callback
* @param {[type]}
*/
db.updateFields = (tableName, idColumnName, idValue, fields, callback) => {
	let fieldArr = [];
	let params = [];
	let counter = 1;

	for (let field in fields) {
		if (field == idColumnName) {
			continue;
		}
		fieldArr.push(`${field}=$${counter}`);
		params.push(fields[field]);
		counter++;
	}
	params.push(idValue);

	let updateStr = fieldArr.join(', ');
	let queryStr = `UPDATE ${tableName} SET ${updateStr} WHERE ${idColumnName} = $ counter;`;
	return db.executeQuery(queryStr, params, callback);
}

export default db;














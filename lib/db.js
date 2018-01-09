import pg from 'pg'
import config from '../configs/global/config'

const pool = new pg.Pool(config.db)
const db = {};

/**
* Execute a query, and return the results.
*
* @param {String} sql
* @param {Array} params
* @param {[type]}
*/
db.executeQuery = async (sql, params) => {

	const client = await pool.connect();
	try {
		return client.query(sql, params).then((res) => {
			return new Promise((resolve, reject) => {
				resolve(res.rows);
			});
		});
	} finally {
		client.release();
	}
};

/**
* Update record for fields
* @param {String} tableName
* @param {String} idColumnName
* @param {Int} idValue
* @param {Object} fields object where keys are columns and values are new values
* @param {[type]}
*/
db.updateFields = (tableName, idColumnName, idValue, fields) => {
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
	let queryStr = `UPDATE ${tableName} SET ${updateStr} WHERE ${idColumnName} = $${counter};`;
	console.log('q', queryStr);
	return db.executeQuery(queryStr, params);
}

db.transactions = (insertFunc, funcParams) => {
	return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        try {
        	console.log('beginnnnnnnnnnnnn')
        	await client.query('BEGIN');
        	console.log('middleeeee')
        	await insertFunc(...funcParams);
        	await client.query('COMMIT');
        	console.log('resolveeeeeeeeeeeeeeee')
        	resolve();
        } catch (e) {
        	await client.query('ROLLBACK');
        	throw e;
        } finally {
        	client.release();
        }
	})
}

export default db;














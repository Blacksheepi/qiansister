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
* @param {Object} fields #object where keys are columns and values are new values
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
/**
* create a transaction, the code in insertFunc is the db SQL to run.
* @params {Function} insertFunc
* @params {Array} funcParams  #the params that will pass to insertFunc
*/

db.transactions = (insertFunc, funcParams) => {
	return new Promise(async (resolve, reject) => {
        const client = await pool.connect();
        try {
        	console.log('beginnnnnnnnnnnnn')
        	await client.query('BEGIN');
        	console.log('middleeeee')
        	await insertFunc(client, ...funcParams);   //transcation will work only when in a same client!
        	await client.query('COMMIT');
        	console.log('committtttttttttt')
        	resolve();
        } catch (e) {
        	await client.query('ROLLBACK');
        	console.log('rollbackkkkkkkkkkk')
        	throw e;
        } finally {
        	client.release();
        }
	})
}

export default db;














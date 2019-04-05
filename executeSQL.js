const sqlstring = require('sqlstring')
const tedious = require('tedious')

function executeSQL (connection, sql) {
    return new Promise((resolve, reject) => {
        const request = new tedious.Request(sql, (error, rowCount, rows) => {
            if (error) {
                reject(error)
            } else {
                resolve(rows)
            }
        })
        connection.execSql(request)
    })
}

module.exports = executeSQL

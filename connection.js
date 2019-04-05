const tedious = require('tedious')

require('dotenv').config();

const ONE_MINUTE = 60 * 1000
const config = {
    server: process.env.DB_HOST,
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        }
    },
    options: {
        database: process.env.DB_DATABASE,
        port: 1433,
        connectTimeout: ONE_MINUTE,
        requestTimeout: ONE_MINUTE,
        encrypt: true,
        enableArithAbort: true,
        connectionIsolationLevel: tedious.ISOLATION_LEVEL.READ_UNCOMMITTED,
        rowCollectionOnRequestCompletion: true
    }
}

function Connection() {
  return new Promise((resolve, reject) => {
    const connection = new tedious.Connection(config)
    connection.on('connect', (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(connection)
      }
    })
  })
}

module.exports = Connection

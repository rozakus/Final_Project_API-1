const util = require('util')
const db = require('../database')

module.exports = {
    generateQuery : (body) => {
        let result = ''
        for (let key in body) {
            result += `${key} = '${body[key]}',`
        }
        return result.slice(0, -1)
    },
    asyncQuery : util.promisify(db.query).bind(db)
}
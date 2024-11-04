const { Pool } = require('pg')

const pool = new Pool({
    user: "kksgy",
    database: "major",
    host: "localhost",
    password: "@369narayan",
    port: 5432

})

module.exports = pool;
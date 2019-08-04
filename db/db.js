const mysql = require('mysql');
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'mysql_001',
    // 开启执行多条sql 语句
    multipleStatements: true
});
module.exports = conn;
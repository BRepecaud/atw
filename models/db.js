exports.getDB = function()
{
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'atw',
    });

    connection.connect();
    global.db = connection;    
}
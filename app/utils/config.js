// const mysql = require('mysql2');
// const express = require('express');
// const bodyparser = require('body-parser');
// var app = express();
// app.use(bodyparser.json());

// app.use(bodyparser.json())
// app.use(bodyparser.urlencoded({ extended: true }))

// const con = getConnectionData('aws');
// // console.log('Con = ', con);
// var mysqlConnection = mysql.createConnection(con);

// mysqlConnection.connect((err) => {
//     if (!err)
//         console.log('Connection Established Successfully');
//     else
//         console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
// });

// module.exports = mysqlConnection;


// function getConnectionData(host = 'localhost') {
//     host = !host || host.toLowerCase().startsWith('local') ? 'localhost' : '13.126.110.70';
//     const conObj = {
//         host: host,
//         user: host.startsWith('local') ? 'root' : 'maiora',
//         password: host.startsWith('local') ? null : 'Madmin@6977',
//         database: host.startsWith('local') ? 'fitsocials' : 'fs-dev',
//         multipleStatements: true
//     };

//     if(host.host === 'localhost') {
//         delete conObj.password;
//     }

//     return conObj;
// }
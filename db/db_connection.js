const mysql = require('mysql2');
const dotenv = require('dotenv')

dotenv.config({path: '../we.env'});

let con = mysql.createConnection({
    // host: process.env.DATABASE_HOST,
    // user: process.env.DATABASE_USER,
    // password: process.env.DATABASE_PASSWORD,
    // database: process.env.DATABASE
    host : '127.0.0.1',
    user : 'root',
    password : '',
    database : 'aifblog2'
});
con.connect((err)=> {
        if(err){
            console.log(err)
            console.log(con.user)
            
        }else{
            console.log('database connected successfully')
        }
});


module.exports = con;
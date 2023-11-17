const mysql = require("mysql2");

const con = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"Bhanu@123",
  database:"crud_oper",
  port: 3306
});

con.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL');
});
module.exports = con;

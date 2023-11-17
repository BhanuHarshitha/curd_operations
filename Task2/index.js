const con = require('./db');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/crud2.html');
});

app.post('/submit', function (req, res) {
    try {
        let fn = req.body.First_Name;
        let ln = req.body.Last_Name;
        let em = req.body.Email_Id;
        let ph = req.body.Mobile_Number;
        let ad = req.body.Start_Date;
        let gen = req.body.Gender;
        let pos = req.body.Position;
        let edu = JSON.stringify(req.body.Qualification);
        console.log(fn, ln, em, ph, ad, gen, pos, edu);

        con.connect(function (error) {
            if (error) {
                console.error('Error connecting to the database:', error);
                res.status(500).send('Internal Server Error');
                return;
            }

            let sql = "INSERT INTO seeker (fn, ln, em, ph, ad, gen, pos, edu) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            con.query(sql, [fn, ln, em, ph, ad, gen, pos, edu], function (error, result) {
                if (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        if (error.message.includes('email')) {
                            console.log('Error: Email address is already registered.');
                        } else if (error.message.includes('ph')) {
                            console.log('Error: Mobile number is already registered.');
                        } else {
                            console.log('Error:', error.message);
                        }
                        res.status(400).send('Duplicate entry error. Please check your input.');
                    } else {
                        console.log('Error:', error.message);
                        res.status(500).send('Internal Server Error');
                    }
                } else {
                    console.log('Submitted Successfully');
                }
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});




app.get('/getSeekerData', function (req, res) {
    con.query("SELECT * FROM seeker", function (error, results) {
        if (error) throw error;
        res.json(results);
    });
});

app.put('/update/:id', function (req, res) {
    try {
        const SeekerId = req.params.id;
        const fn = req.body.First_Name;
        const ln = req.body.Last_Name;
        const em = req.body.Email_Id;
        const ph = req.body.Mobile_Number;
        const ad = req.body.Start_Date;
        const gen = req.body.Gender;
        const pos = req.body.Position;
        const edu = JSON.stringify(req.body.Qualification);
        console.log(fn, ln, em, ph, ad, gen, pos, edu);


        let sql = "UPDATE seeker SET fn=?, ln=?, em=?, ph=?, ad=?, gen=?, pos=?, edu=? WHERE SeekerId=?";
        con.query(sql, [fn, ln, em, ph, ad, gen, pos, edu, SeekerId], function (error, result) {
            if (error) {
                console.error('Error updating data:', error);
                res.status(500).send('Internal Server Error');
            } else {
                console.log("Updated Successfully");
                res.json({ message: 'Updated Successfully' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/delete/:id', function (req, res) {
    const SeekerId = req.params.id;
    let sql = "DELETE FROM seeker WHERE SeekerId=?"
    con.query(sql, [SeekerId], function (error, result) {
        if (error) {
            console.error('Error deleting data:', error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log("Deleted Successfully");
            res.json({ message: 'Deleted Successfully' });
        }
    });
});

app.get('/search', function (req, res) {
    const searchData = req.query.search.toLowerCase();
    let sql = "SELECT * FROM seeker WHERE LOWER(fn) LIKE ? OR LOWER(ph) LIKE ?"; 
    con.query(sql, [`%${searchData}%`, `%${searchData}%`], function (error, result) {
        if (error) {
            console.error('Error searching data:', error);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(result);
        }
    });
});


const port = 5500;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

var express = require('express');
var router = express.Router();
var db = require('../database');

/* Retrieve all meetings. */
router.get('/meetings', function(req, res, next) {
     db.query('SELECT * from meetings', function (error, results, fields) {
          if (error) {
               res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
          } else {
               res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
          }
     });
});

// Retrieve meeting with specific Id.
router.get('/meeting/:id', function (req, res) {
     let meetingId = req.params.id;
     if (!meetingId) {
          return res.status(400).send({ error: true, message: 'Please provide meeting Id.' });
     }
     db.query('SELECT * FROM meetings where id = ?', meetingId, function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
               let responseMsg = 'You retrieved meeting Id ' + meetingId + '.';
               return res.send({ error: false, data: results[0], message: responseMsg });
          } else {
               return res.send({ error: false, data: results[0], message: 'You couldn\'t retrieve any meetings because there are none.' });
          }
          
     });
});

// Add new meeting - worker log.
router.post('/meeting', function (req, res) {
     let time = req.body.time;
     let user_id = req.body.user_id;
     let userFound = false;

     db.query("SELECT * from workers where id = ?", user_id, function (error, results, fields) {
          if (error) {
               res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
          } else {
               workerRow = JSON.parse(JSON.stringify(results));
               if (workerRow.length > 0) {
                    if (!time) {
                         return res.status(400).send({ error: true, message: 'Please provide meeting time (string).' });
                    } else {
                         let late = null;
               
                         let uslov_h = false;
                         let uslov_m = false;
               
                         const prag_dolaska = 31500; // Broj sekundi koji je ustvari 8 sati i 45 minuta (8:45 je prag dolaska na vrijeme).
               
                         let fields = time.split(':');
               
                         let hours = fields[0];
                         let minutes = fields[1];
               
                         let h = Number(hours);
                         let m = Number(minutes);
               
                         let sekunde = (m * 60) + ((h * 60) * 60); // Broj sekundi koje treba uporediti.
                         if (sekunde > prag_dolaska)
                              late = true;
                         else
                              late = false;
               
                         if (h >= 0 && h < 24) { // Ovo su pravilno uneseni sati.
                              uslov_h = true;
                         }
               
                         if (m >= 0 && m < 60) { // Ovo su pravilno unesene minute.
                              uslov_m = true;
                         }
               
                         if (uslov_h == true && uslov_m == true) {
                              db.query("INSERT INTO meetings SET user_id = ?, time = ?, late = ?", [user_id, time, late], function (error, results, fields) {
                                   if (error) throw error;
                                   return res.send({ error: false, data: results, message: 'New meeting has been added successfully.' });
                              });
                         }
                         else {
                              return res.send({ message: 'New meeting couldn\'t be added because the time is not in valid format.' });
                         }
                    }
               } else {
                    res.send({ message: 'New meeting couldn\'t be added because the user Id is not found.' });
               }
          }
     });

});

module.exports = router;
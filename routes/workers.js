var express = require('express');
var router = express.Router();
var db = require('../database');

/* Retrieve all workers. */
router.get('/workers', function(req, res, next) {
     db.query('SELECT * from workers', function (error, results, fields) {
          if (error) {
               res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
          } else {
               res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
          }
     });
});

// Retrieve worker with specific Id.
router.get('/worker/:id', function (req, res) {
     let workerId = req.params.id;
     if (!workerId) {
          return res.status(400).send({ error: true, message: 'Please provide worker Id.' });
     }
     db.query('SELECT * FROM workers where id = ?', workerId, function (error, results, fields) {
          if (error) throw error;
          let responseMsg = 'You retrieved worker Id ' + workerId + '.';
          return res.send({ error: false, data: results[0], message: responseMsg });
     });
});

// Add new worker.
router.post('/worker', function (req, res) {
     let name = req.body.name;
     if (!name) {
          return res.status(400).send({ error: true, message: 'Please provide worker name (string).' });
     } else {
          db.query("INSERT INTO workers SET name = ?", name, function (error, results, fields) {
               if (error) throw error;
               return res.send({ error: false, data: results, message: 'New worker has been added successfully.' });
          });
     }
});

// Deleting worker with specific Id.
router.delete('/worker/:id', function (req, res) {
     let workerId = req.params.id;
     db.query('DELETE FROM workers WHERE id = ?', workerId, function (error, results, fields) {
          if (error) throw error;
          return res.send({ error: false, data: results, message: 'Worker has been deleted successfully.' });
     });
});

// Update worker with specific Id.
router.put('/worker/:id', function (req, res) {
     let workerId = req.params.id;
     let name = req.body.name;
     if (!name) {
          return res.status(400).send({ error: true, message: 'Please provide new name.' });
     } else {
          db.query("UPDATE workers SET name = ? WHERE id = ?", [name, workerId], function (error, results, fields) {
               if (error) throw error;
               return res.send({ error: false, data: results, message: 'Worker has been updated successfully.' });
          });
     }
});

module.exports = router;
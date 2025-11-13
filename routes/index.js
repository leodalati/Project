var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});
/* GET Create page. */
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Create' });
});
/* GET Update page. */
router.get('/update', function(req, res, next) {
  res.render('update', { title: 'Update' });
});
/* GET Delete page. */
router.get('/delete', function(req, res, next) {
  res.render('delete', { title: 'Delete' });
});

module.exports = router;

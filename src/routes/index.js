const express = require('express');
const router = express.Router();
// const Canvas = require('canvas');


router.get('/', (req, res) => {
  res.render('tool');
});

module.exports = router;




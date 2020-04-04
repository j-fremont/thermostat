'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res, next) => {
  fs.readFile("state.json", (error, data) => {
    if (error) throw error;
    res.send(JSON.parse(data));
  });
});

module.exports = router;

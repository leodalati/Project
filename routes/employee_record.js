let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let employee_record = require('../models/employee_record');


// Read data from database
router.get('/', async(req, res, next) => {
  try {
    const EmployeeRecords = await employee_record.find();
    //console.log(EmployeeRecords);
      res.render('Employee_records/list', {
      title: 'Employee Records',
      EmployeeRecords: EmployeeRecords
    })

  }
  catch(err) {
    console.error(err);
    //res.render
  }
});

module.exports = router;
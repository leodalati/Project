var express = require('express');
var router = express.Router();
let employee_record = require('../models/employee_record');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET Create page - Show create form */
router.get('/create', function(req, res, next) {
  res.render('create', { 
    title: 'Create Employee',
    employee: {} // Empty object for new employee
  });
});

/* POST Create page - Handle form submission */
router.post('/create', async function(req, res, next) {
  try {
    const newEmployee = new employee_record({
      name: req.body.name,
      position: req.body.position,
      department: req.body.department,
      contact_info: req.body.contact_info,
      employment_status: req.body.employment_status
    });
    
    await newEmployee.save();
    res.redirect('/employee_records'); // Redirect to records after creation
  }
  catch(err) {
    console.error(err);
    res.render('create', {
      title: 'Create Employee - Error',
      employee: req.body,
      error: 'Error creating employee: ' + err.message
    });
  }
});

/* GET Update page - Show employee selection */
router.get('/update', async function(req, res, next) {
  try {
    const EmployeeRecords = await employee_record.find();
    res.render('update', { 
      title: 'Update Employee',
      EmployeeRecords: EmployeeRecords
    });
  }
  catch(err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

/* GET Update form for specific employee */
router.get('/update/:id', async function(req, res, next) {
  try {
    const employee = await employee_record.findById(req.params.id);
    if (!employee) {
      return res.render('error', { error: 'Employee not found' });
    }
    
    res.render('update_form', {
      title: 'Edit Employee',
      employee: employee
    });
  }
  catch(err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

/* POST Update form - Handle employee update */
router.post('/update/:id', async function(req, res, next) {
  try {
    const updatedEmployee = {
      name: req.body.name,
      position: req.body.position,
      department: req.body.department,
      contact_info: req.body.contact_info,
      employment_status: req.body.employment_status
    };
    
    await employee_record.findByIdAndUpdate(req.params.id, updatedEmployee);
    res.redirect('/employee_records');
  }
  catch(err) {
    console.error(err);
    const employee = await employee_record.findById(req.params.id);
    res.render('update_form', {
      title: 'Edit Employee - Error',
      employee: employee,
      error: 'Error updating employee: ' + err.message
    });
  }
});

/* GET Delete page. Redirect to employee records delete listing */
router.get('/delete', function(req, res, next) {
  res.redirect('/employee_records/delete');
});

module.exports = router;
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let employee_record = require('../models/employee_record');

//  Get route for the read employee records -- read operation
router.get('/', async (req, res, next) => {
  try {
    const EmployeeRecords = await employee_record.find();
    res.render('employee_records/list', {
      title: 'Employee Records',
      EmployeeRecords: EmployeeRecords
    });
  }
  catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

// GET - Show Create Employee Form
router.get('/create', (req, res) => {
  res.render('employee_records/create', {
    title: 'Add New Employee'
  });
});

// POST - Handle Create Employee Form Submission
router.post('/create', async (req, res) => {
  try {
    const newEmployee = new employee_record({
      name: req.body.name,
      position: req.body.position,
      department: req.body.department,
      contact_info: req.body.contact_info,
      employment_status: req.body.employment_status
    });

    await newEmployee.save();
    res.redirect('/employee_records');
  }
  catch (err) {
    console.error(err);
    res.render('employee_records/create', {
      title: 'Add New Employee - Error',
      error: 'Error creating employee: ' + err.message
    });
  }
});

// GET - Show Edit Employee Form
router.get('/:id/edit', async (req, res) => {
  try {
    const employee = await employee_record.findById(req.params.id);
    if (!employee) {
      return res.render('error', { error: 'Employee not found' });
    }

    res.render('employee_records/update', {
      title: 'Edit Employee',
      employee: employee
    });
  }
  catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

// POST - Handle Update Employee Form Submission
router.post('/:id/update', async (req, res) => {
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
  catch (err) {
    console.error(err);
    const employee = await employee_record.findById(req.params.id);
    res.render('employee_records/update', {
      title: 'Edit Employee - Error',
      employee: employee,
      error: 'Error updating employee: ' + err.message
    });
  }
});

// GET - Show delete listing page (same table but allows deletion)
router.get('/delete', async (req, res) => {
  try {
    const EmployeeRecords = await employee_record.find();
    res.render('employee_records/delete', {
      title: 'Delete Employee Records',
      EmployeeRecords: EmployeeRecords
    });
  } catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

// POST - Perform deletion and redirect back to delete listing
router.post('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await employee_record.deleteOne({ _id: id });
    return res.redirect('/employee_records/delete');
  } catch (err) {
    console.error(err);
    return res.render('error', { error: err });
  }
});

module.exports = router;
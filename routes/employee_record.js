/**
 * Employee Records Routes
 * 
 * This file handles HTTP request/response logic and DISPLAY of data.
 * All CRUD operations are delegated to the employeeService layer.
 * 
 * SEPARATION OF CONCERNS:
 * - Routes: Handle requests, responses, and rendering views (DISPLAY LOGIC)
 * - Services: Handle database operations and business logic (CRUD LOGIC)
 */

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
// Import the service layer that handles CRUD operations
const employeeService = require('../services/employeeService');

/**
 * DISPLAY LOGIC: Render the list view with employee data
 * CRUD LOGIC: Delegated to employeeService.getAllEmployees()
 */
router.get('/', async (req, res, next) => {
  try {
    // CRUD OPERATION: Fetch all employees from MongoDB via service layer
    const EmployeeRecords = await employeeService.getAllEmployees();
    
    // DISPLAY LOGIC: Render the view with the fetched data
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

/**
 * DISPLAY LOGIC: Show the create employee form
 * No CRUD operation needed - just displaying the form
 */
router.get('/create', (req, res) => {
  // DISPLAY LOGIC: Render the create form
  res.render('employee_records/create', {
    title: 'Add New Employee',
    employee: {}
  });
});

/**
 * DISPLAY LOGIC: Handle form submission and redirect/render response
 * CRUD LOGIC: Delegated to employeeService.createEmployee()
 */
router.post('/create', async (req, res) => {
  try {
    // CRUD OPERATION: Create new employee via service layer
    await employeeService.createEmployee(req.body);
    
    // DISPLAY LOGIC: Redirect to the list page after successful creation
    res.redirect('/employee_records');
  }
  catch (err) {
    console.error(err);
    // DISPLAY LOGIC: Re-render the form with error message
    res.render('employee_records/create', {
      title: 'Add New Employee - Error',
      error: err.message
    });
  }
});

/**
 * DISPLAY LOGIC: Show the edit employee form with existing data
 * CRUD LOGIC: Delegated to employeeService.getEmployeeById()
 */
router.get('/:id/edit', async (req, res) => {
  try {
    // CRUD OPERATION: Fetch employee by ID via service layer
    const employee = await employeeService.getEmployeeById(req.params.id);

    // DISPLAY LOGIC: Render the edit form with employee data
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

/**
 * DISPLAY LOGIC: Handle form submission and redirect/render response
 * CRUD LOGIC: Delegated to employeeService.updateEmployee()
 */
router.post('/:id/update', async (req, res) => {
  try {
    // CRUD OPERATION: Update employee via service layer
    await employeeService.updateEmployee(req.params.id, req.body);
    
    // DISPLAY LOGIC: Redirect to the list page after successful update
    res.redirect('/employee_records');
  }
  catch (err) {
    console.error(err);
    
    try {
      // CRUD OPERATION: Fetch employee data to re-render the form
      const employee = await employeeService.getEmployeeById(req.params.id);
      
      // DISPLAY LOGIC: Re-render the form with error message
      res.render('employee_records/update', {
        title: 'Edit Employee - Error',
        employee: employee,
        error: err.message
      });
    } catch (fetchError) {
      // If we can't fetch the employee, render generic error page
      console.error('Error fetching employee for re-render:', fetchError);
      res.render('error', { error: err });
    }
  }
});

/**
 * DISPLAY LOGIC: Show the delete page with employee data
 * CRUD LOGIC: Delegated to employeeService.getAllEmployees()
 */
router.get('/delete', async (req, res) => {
  try {
    // CRUD OPERATION: Fetch all employees from MongoDB via service layer
    const EmployeeRecords = await employeeService.getAllEmployees();
    
    // DISPLAY LOGIC: Render the delete view with the fetched data
    res.render('employee_records/delete', {
      title: 'Delete Employee Records',
      EmployeeRecords: EmployeeRecords
    });
  } catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

/**
 * DISPLAY LOGIC: Handle deletion and redirect
 * CRUD LOGIC: Delegated to employeeService.deleteEmployee()
 */
router.post('/delete/:id', async (req, res) => {
  try {
    // CRUD OPERATION: Delete employee via service layer
    await employeeService.deleteEmployee(req.params.id);
    
    // DISPLAY LOGIC: Redirect back to delete listing page
    return res.redirect('/employee_records/delete');
  } catch (err) {
    console.error(err);
    return res.render('error', { error: err });
  }
});

module.exports = router;
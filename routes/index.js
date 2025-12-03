var express = require('express');
var router = express.Router();
let employee_record = require('../models/employee_record');
const passport = require('passport');
let DB = require('../config/db');
let userModel = require('../models/user');
let User = userModel.User;

// Authentication middleware
function requireAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Home',displayName: req.user ? req.user.displayName : '' });
});

/* GET Create page - Show create form */

router.get('/create', requireAuth, function (req, res, next) {
  res.render('employee_records/create', {
    title: 'Create Employee', displayName: req.user ? req.user.displayName : '',
    employee: {}
  });
});

/* POST Create page - Handle form submission */
router.post('/create', requireAuth, async function (req, res, next) {
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
  catch (err) {
    console.error(err);
    res.render('employee_records/create', {
      title: 'Create Employee - Error', displayName: req.user ? req.user.displayName : '',
      employee: req.body,
      error: 'Error creating employee: ' + err.message
    });
  }
});

/* GET Update page - Show employee selection */
router.get('/update', requireAuth, async function (req, res, next) {
  try {
    const EmployeeRecords = await employee_record.find();
    res.render('update', {
      title: 'Update Employee', displayName: req.user ? req.user.displayName : '',
      EmployeeRecords: EmployeeRecords
    });
  }
  catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

/* GET Update form for specific employee */
router.get('/update/:id', requireAuth, async function (req, res, next) {
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
  catch (err) {
    console.error(err);
    res.render('error', { error: err });
  }
});

/* POST Update form - Handle employee update */
router.post('/update/:id', requireAuth, async function (req, res, next) {
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
    res.render('update_form', {
      title: 'Edit Employee - Error',
      employee: employee,
      error: 'Error updating employee: ' + err.message
    });
  }
});

/* GET Delete page. Redirect to employee records delete listing */
router.get('/delete', requireAuth, function (req, res, next) {
  res.redirect('/employee_records/delete');
});


// Get method for login
router.get('/login', function (req, res, next) {
  if (!req.user) {
    res.render('auth/login', {
      title: 'Login',
      message: req.flash('loginMessage'),
    });
  } else {
    return res.redirect('/');
  }
});

// Post method for login
router.post('/login', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('loginMessage', 'Incorrect username or password!');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/employee_records');
    });
  })(req, res, next);
});

// Get method for register
router.get('/register', function (req, res, next) {
  if (!req.user) {
    res.render('auth/register', {
      title: 'Register',
      message: req.flash('registerMessage'),
    });
  } else {
    return res.redirect('/');
  }


});

// Post method for register
router.post('/register', function (req, res, next) {
  let newUser = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    displayName: req.body.displayName
  });
  User.register(newUser, req.body.password, function (err) {
    if (err) {
      console.log("Error: Inserting New User");
      if (err.name == "UserExistsError") {
        req.flash('registerMessage', 'Registration Error: User Already Exists!');
      }
      return res.render('auth/register', {
        title: 'Register',
        message: req.flash('registerMessage'),
      });
    }
    else {
      // if no error exists, then registration is successful
      return passport.authenticate('local')(req, res, () => {
        res.redirect('/employee_records');
      });
    }
  });
});

// Log a user out
router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { 
            return next(err);
        }
        res.redirect('/');  
    });
});
module.exports = router;
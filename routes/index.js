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

// PASSWORD CHANGE FUNCTIONALITY

// GET route: Display the password change form
router.get('/change_password', requireAuth, function (req, res, next) {
  res.render('auth/change_password', {
    title: 'Change Password',
    message: req.flash('changePasswordMessage'),
    displayName: req.user ? req.user.displayName : ''
  });
});

// POST route: Handle password change submission
// - Validates that both new passwords match
// - Authenticates the user with their current password
// - Sets the new password using passport-local-mongoose
// - Redirects to home page on success or shows error message on failure
router.post('/change_password', requireAuth, function (req, res, next) {
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  // Check if new password and confirm password match
  if (newPassword !== confirmPassword) {
    req.flash('changePasswordMessage', 'New passwords do not match!');
    return res.redirect('/change_password');
  }

  // Check if new password is not empty
  if (!newPassword || newPassword.trim() === '') {
    req.flash('changePasswordMessage', 'New password cannot be empty!');
    return res.redirect('/change_password');
  }

  // Check if current password is provided
  if (!currentPassword || currentPassword.trim() === '') {
    req.flash('changePasswordMessage', 'Please enter your current password!');
    return res.redirect('/change_password');
  }

  // Authenticate user with current password
  User.authenticate()(req.user.username, currentPassword, function(err, user, info) {
    if (err) {
      console.error("Authentication error:", err);
      req.flash('changePasswordMessage', 'An error occurred during authentication!');
      return res.redirect('/change_password');
    }

    // If user is not authenticated, current password is incorrect
    if (!user) {
      req.flash('changePasswordMessage', 'Current password is incorrect!');
      return res.redirect('/change_password');
    }

    // Current password is correct, now set the new password
    user.setPassword(newPassword, function(err) {
      if (err) {
        console.error("Error setting password:", err);
        req.flash('changePasswordMessage', 'Error changing password. Please try again.');
        return res.redirect('/change_password');
      }

      // Save the user with the new hashed password
      user.save()
        .then(() => {
          // Password changed successfully
          req.flash('changePasswordMessage', 'Password changed successfully! Please log in again.');
          // Log the user out so they can log back in with new password
          req.logout(function(logoutErr) {
            if (logoutErr) {
              return next(logoutErr);
            }
            res.redirect('/login');
          });
        })
        .catch((err) => {
          console.error("Error saving user:", err);
          req.flash('changePasswordMessage', 'Error saving password. Please try again.');
          res.redirect('/change_password');
        });
    });
  });
});

module.exports = router;
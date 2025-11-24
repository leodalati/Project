# Code Architecture: Separation of Display and CRUD Logic

## Overview
This document explains the separation between code that handles **displaying data from MongoDB** and code that handles **CRUD logic**.

## Architecture Layers

### 1. **Models Layer** (`/models`)
- **Purpose**: Define MongoDB schemas
- **File**: `employee_record.js`
- **Responsibilities**:
  - Define the structure of employee records in MongoDB
  - Use Mongoose to create the schema
  - Export the model for use by other layers

### 2. **Services Layer** (`/services`) - **CRUD LOGIC**
- **Purpose**: Handle all database operations and business logic
- **File**: `employeeService.js`
- **Responsibilities**:
  - **CREATE**: Add new employee records to MongoDB
  - **READ**: Fetch employee records from MongoDB (all or by ID)
  - **UPDATE**: Modify existing employee records in MongoDB
  - **DELETE**: Remove employee records from MongoDB
  - Encapsulate all direct MongoDB interactions
  - Provide clean API for data operations
  - Handle errors related to database operations

**Key Functions**:
- `getAllEmployees()` - Fetch all employee records
- `getEmployeeById(id)` - Fetch a specific employee
- `createEmployee(data)` - Create a new employee
- `updateEmployee(id, data)` - Update an employee
- `deleteEmployee(id)` - Delete an employee

### 3. **Routes/Controllers Layer** (`/routes`) - **DISPLAY LOGIC**
- **Purpose**: Handle HTTP requests/responses and render views
- **File**: `employee_record.js`
- **Responsibilities**:
  - Handle incoming HTTP requests (GET, POST)
  - Call service layer for CRUD operations
  - Render EJS templates with data
  - Handle redirects after successful operations
  - Display error messages when operations fail
  - Manage the request/response cycle

**Key Routes**:
- `GET /` - Display list of all employees
- `GET /create` - Display create form
- `POST /create` - Handle form submission (calls service)
- `GET /:id/edit` - Display edit form
- `POST /:id/update` - Handle update submission (calls service)
- `GET /delete` - Display delete page
- `POST /delete/:id` - Handle deletion (calls service)

### 4. **Views Layer** (`/views`) - **DISPLAY TEMPLATES**
- **Purpose**: HTML templates for displaying data
- **Files**: `employee_records/list.ejs`, `create.ejs`, `update.ejs`, `delete.ejs`
- **Responsibilities**:
  - Define HTML structure for displaying employee data
  - Use Bootstrap for styling
  - Render data passed from routes
  - Display forms for user input

## Data Flow

### Example: Viewing Employee Records

1. **User** makes a request to `/employee_records`
2. **Routes** (`routes/employee_record.js`) receives the GET request
3. **Routes** calls `employeeService.getAllEmployees()` (**CRUD LOGIC**)
4. **Service** (`services/employeeService.js`) executes `employee_record.find()` to query MongoDB
5. **Service** returns the employee data to Routes
6. **Routes** renders the view with data: `res.render('employee_records/list', { EmployeeRecords })` (**DISPLAY LOGIC**)
7. **View** (`views/employee_records/list.ejs`) displays the data in HTML table

### Example: Creating an Employee

1. **User** submits form at `/employee_records/create`
2. **Routes** receives the POST request with form data
3. **Routes** calls `employeeService.createEmployee(req.body)` (**CRUD LOGIC**)
4. **Service** creates new employee document and saves to MongoDB
5. **Service** returns success/error to Routes
6. **Routes** redirects to list page or re-renders form with error (**DISPLAY LOGIC**)

## Benefits of This Separation

1. **Maintainability**: Changes to database operations don't affect display logic and vice versa
2. **Testability**: Services can be tested independently from routes
3. **Reusability**: Services can be used by multiple routes or other parts of the application
4. **Clarity**: Clear distinction between data operations and presentation
5. **Scalability**: Easy to add new features or change database without affecting display

## Summary

| Layer | File(s) | Purpose | Type of Logic |
|-------|---------|---------|---------------|
| **Models** | `models/employee_record.js` | Define schemas | Data Structure |
| **Services** | `services/employeeService.js` | Database operations | **CRUD LOGIC** |
| **Routes** | `routes/employee_record.js` | Request handling & rendering | **DISPLAY LOGIC** |
| **Views** | `views/employee_records/*.ejs` | HTML templates | **DISPLAY TEMPLATES** |

## Code Example

### CRUD Logic (Service Layer)
```javascript
// services/employeeService.js
async function getAllEmployees() {
  return await employee_record.find(); // Direct MongoDB interaction
}
```

### Display Logic (Routes Layer)
```javascript
// routes/employee_record.js
router.get('/', async (req, res) => {
  const employees = await employeeService.getAllEmployees(); // Call service
  res.render('employee_records/list', { EmployeeRecords: employees }); // Render view
});
```

This clear separation ensures that:
- **CRUD logic** is isolated in the services layer
- **Display logic** is handled by routes and views
- Each layer has a single, well-defined responsibility

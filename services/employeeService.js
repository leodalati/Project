/**
 * Employee Service
 * 
 * This service handles all CRUD (Create, Read, Update, Delete) operations
 * for employee records in MongoDB. It acts as a data access layer, separating
 * database logic from the routing/display logic.
 */

const employee_record = require('../models/employee_record');

/**
 * CRUD OPERATION: Read all employee records from MongoDB
 * @returns {Promise<Array>} Array of all employee records
 */
async function getAllEmployees() {
  try {
    return await employee_record.find();
  } catch (error) {
    throw new Error(`Error fetching employees: ${error.message}`);
  }
}

/**
 * CRUD OPERATION: Read a single employee record by ID from MongoDB
 * @param {string} id - The employee ID
 * @returns {Promise<Object>} The employee record
 */
async function getEmployeeById(id) {
  try {
    const employee = await employee_record.findById(id);
    if (!employee) {
      throw new Error('Employee not found');
    }
    return employee;
  } catch (error) {
    throw new Error(`Error fetching employee: ${error.message}`);
  }
}

/**
 * CRUD OPERATION: Create a new employee record in MongoDB
 * @param {Object} employeeData - The employee data to create
 * @returns {Promise<Object>} The created employee record
 */
async function createEmployee(employeeData) {
  try {
    const newEmployee = new employee_record({
      name: employeeData.name,
      position: employeeData.position,
      department: employeeData.department,
      contact_info: employeeData.contact_info,
      employment_status: employeeData.employment_status
    });
    
    return await newEmployee.save();
  } catch (error) {
    throw new Error(`Error creating employee: ${error.message}`);
  }
}

/**
 * CRUD OPERATION: Update an existing employee record in MongoDB
 * @param {string} id - The employee ID
 * @param {Object} employeeData - The updated employee data
 * @returns {Promise<Object>} The updated employee record
 */
async function updateEmployee(id, employeeData) {
  try {
    const updatedEmployee = {
      name: employeeData.name,
      position: employeeData.position,
      department: employeeData.department,
      contact_info: employeeData.contact_info,
      employment_status: employeeData.employment_status
    };
    
    const result = await employee_record.findByIdAndUpdate(id, updatedEmployee, { new: true });
    
    if (!result) {
      throw new Error('Employee not found');
    }
    
    return result;
  } catch (error) {
    throw new Error(`Error updating employee: ${error.message}`);
  }
}

/**
 * CRUD OPERATION: Delete an employee record from MongoDB
 * @param {string} id - The employee ID to delete
 * @returns {Promise<Object>} Result of the deletion
 */
async function deleteEmployee(id) {
  try {
    const result = await employee_record.findByIdAndDelete(id);
    
    if (!result) {
      throw new Error('Employee not found');
    }
    
    return result;
  } catch (error) {
    throw new Error(`Error deleting employee: ${error.message}`);
  }
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};

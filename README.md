Authors: Logan Bagby. Leo Dalati, Ferooz Said

EMPLOYEE RECORD MANAGEMENT SYSTEM 
==================================

A full-stack web application for managing employee records built with Node.js, Express.js, 
MongoDB, and EJS templates. This system provides a complete CRUD (Create, Read, Update, Delete) 
interface for managing employee information.

DESCRIPTION
-----------
This Employee Record Management System allows organizations to efficiently manage their 
employee database through a user-friendly web interface. The application provides full 
functionality to create new employee records, view all records, update existing information, 
and delete records when needed.

FEATURES
--------
Home Dashboard - Welcome page with system overview
Create Employee Records - Add new employees with comprehensive information
View All Records - Browse through employee database
Update Records - Modify existing employee information
Delete Records - Remove employee records with confirmation
Error Handling - Comprehensive error pages and validation

EMPLOYEE DATA FIELDS
-------------------
Each employee record contains:
- Full Name
- Position/Job Title
- Department
- Contact Information
- Employment Status (Full-time, Part-time, Contract, Intern)

TECHNOLOGY STACK
----------------
Backend:
- Node.js - JavaScript runtime
- Express.js v4.16.1 - Web application framework
- Mongoose v8.19.4 - MongoDB object modeling

Frontend:
- EJS v2.6.1 - Embedded JavaScript templating
- Bootstrap 5.3.0 - Responsive CSS framework
- Custom CSS styling

Database:
- MongoDB - NoSQL database for employee records

PREREQUISITES
-------------
Before running this application, ensure you have:
- Node.js (version 14.x or higher)
- npm (Node Package Manager)
- MongoDB Atlas account OR local MongoDB installation
- Git (for cloning the repository)

INSTALLATION
------------
1. Clone the repository:
   git clone https://github.com/leodalati/Project.git
   cd Project

2. Install all dependencies:
   npm install

3. Set up environment variables:
   Create a .env file in the root directory and add:
   
   MONGODB_URI=your_mongodb_connection_string
   
   Example:
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/employee_db

USAGE
-----
1. Start the application:
   npm start

2. Open your web browser and navigate to:
   http://localhost:3000

3. Use the navigation menu to access different features:
   - Home: View the welcome page
   - Create: Add new employee records
   - Records: View all employees in the database
   - Update: Edit existing employee information
   - Delete: Remove employee records

DEPLOYMENT
----------
Used render to host our website.
https://final-project-aejd.onrender.com/
